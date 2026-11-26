#!/usr/bin/env node
// Builds the stats cards shown on the org profile README.
//
//   node scripts/profile-stats.mjs <out-dir>            write stats-light.svg, stats-dark.svg, stats.json
//   node scripts/profile-stats.mjs <out-dir> --publish  also commit them to the `stats` branch
//
// Reads public GitHub data only. Needs GITHUB_TOKEN (any token works; locally: GITHUB_TOKEN=$(gh auth token)).
// Publishing goes through the Git Data API, so GitHub signs the commit. The branch keeps one
// orphan commit: each run replaces it, the history never grows.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ORG = 'mdgascar';
const SPEC_REPO = 'mdg-utils-spec';
const STATS_BRANCH = 'stats';
const API = 'https://api.github.com';
const API_VERSION = '2022-11-28';
const PER_PAGE = 100;
const TOP_LANGUAGES = 5;
const PUBLISH_FLAG = '--publish';
const FILE_MODE = '100644';
const HTTP_NO_CONTENT = 204;
const HTTP_NOT_FOUND = 404;
const HTTP_UNPROCESSABLE = 422;
const BASE64 = 'base64';
const VECTOR_LINE = /^- /gm;
const LAST_PAGE = /[?&]page=(\d+)>; rel="last"/;
const BOT_SUFFIX = '[bot]';
const ISO_DATE_LENGTH = 10;

// Card layout
const CARD_WIDTH = 840;
const CARD_HEIGHT = 282;
const CARD_RADIUS = 12;
const PADDING = 28;
const COLUMNS = 4;
const TILE_TOP = 78;
const TILE_ROW_HEIGHT = 72;
const VALUE_SIZE = 30;
const LABEL_SIZE = 13;
const LABEL_OFFSET = 22;
const TITLE_SIZE = 17;
const TITLE_BASELINE = 44;
const BAR_TOP = 226;
const BAR_HEIGHT = 8;
const BAR_RADIUS = 4;
const LEGEND_BASELINE = 258;
const LEGEND_DOT = 5;
const LEGEND_GAP = 18;
const LEGEND_CHAR_WIDTH = 7.2;
const PERCENT = 100;
const PERCENT_DECIMALS = 1;
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI','Noto Sans',Helvetica,Arial,sans-serif";
const GROUP = /\B(?=(\d{3})+(?!\d))/g;
const NBSP = ' ';

const FLAG_RED = '#e22b27';
const FLAG_GREEN = '#64c34f';
const THEMES = {
  light: { bg: '#ffffff', border: '#d0d7de', text: '#1f2328', muted: '#59636e', track: '#eff2f5' },
  dark: { bg: '#0d1117', border: '#30363d', text: '#e6edf3', muted: '#9198a1', track: '#21262d' },
};
// GitHub Linguist colours for the languages used in the org
const LANGUAGE_COLOURS = {
  TypeScript: '#3178c6',
  PHP: '#4f5d95',
  JavaScript: '#f1e05a',
  Astro: '#ff5a03',
  MDX: '#fcb32c',
  Shell: '#89e051',
  CSS: '#663399',
  HTML: '#e34c26',
  Just: '#384d54',
  Twig: '#c1d026',
};
const OTHER_LANGUAGE = 'Other';
const OTHER_COLOUR = '#8b949e';

const token = process.env.GITHUB_TOKEN;
if (!token) throw new Error('GITHUB_TOKEN is required');
const headers = {
  Accept: 'application/vnd.github+json',
  Authorization: `Bearer ${token}`,
  'X-GitHub-Api-Version': API_VERSION,
};

async function request(method, path, body) {
  const res = await fetch(`${API}${path}`, { method, headers, body: body && JSON.stringify(body) });
  if (res.status === HTTP_NO_CONTENT) return { res, data: [] };
  const data = await res.json();
  return { res, data };
}

async function get(path) {
  const { res, data } = await request('GET', path);
  if (!res.ok) throw new Error(`GET ${path}: ${res.status} ${data.message}`);
  return { res, data };
}

async function fileText(repo, path) {
  const { data } = await get(`/repos/${ORG}/${repo}/contents/${path}`);
  return Buffer.from(data.content, BASE64).toString('utf8');
}

async function commitCount(repo) {
  const { res, data } = await get(`/repos/${ORG}/${repo}/commits?per_page=1`);
  const last = res.headers.get('link')?.match(LAST_PAGE);
  return last ? Number(last[1]) : data.length;
}

async function collect() {
  const { data: repos } = await get(`/orgs/${ORG}/repos?type=public&per_page=${PER_PAGE}`);
  const active = repos.filter((r) => !r.fork && !r.archived);

  const contributors = new Set();
  const languages = {};
  let commits = 0;
  for (const repo of active) {
    const { data: people } = await get(`/repos/${ORG}/${repo.name}/contributors?per_page=${PER_PAGE}`);
    for (const p of people) if (p.type !== 'Bot' && !p.login.endsWith(BOT_SUFFIX)) contributors.add(p.login);
    const { data: langs } = await get(`/repos/${ORG}/${repo.name}/languages`);
    for (const [lang, bytes] of Object.entries(langs)) languages[lang] = (languages[lang] ?? 0) + bytes;
    commits += await commitCount(repo.name);
  }

  const { data: merged } = await get(`/search/issues?q=${encodeURIComponent(`org:${ORG} is:pr is:merged`)}&per_page=1`);
  const specVersion = (await fileText(SPEC_REPO, 'VERSION')).trim();
  const { data: moduleDirs } = await get(`/repos/${ORG}/${SPEC_REPO}/contents/modules`);
  const modules = moduleDirs.filter((d) => d.type === 'dir').map((d) => d.name);
  let vectors = 0;
  for (const m of modules) vectors += (await fileText(SPEC_REPO, `modules/${m}/tests.yaml`)).match(VECTOR_LINE)?.length ?? 0;

  return {
    updated: new Date().toISOString().slice(0, ISO_DATE_LENGTH),
    repositories: active.length,
    stars: active.reduce((sum, r) => sum + r.stargazers_count, 0),
    forks: active.reduce((sum, r) => sum + r.forks_count, 0),
    contributors: contributors.size,
    commits,
    mergedPullRequests: merged.total_count,
    specVersion,
    modules: modules.length,
    vectors,
    languages,
  };
}

const escapeXml = (s) => String(s).replace(/[<>&"']/g, (c) => `&#${c.charCodeAt(0)};`);
const group = (n) => String(n).replace(GROUP, NBSP);

function topLanguages(languages) {
  const total = Object.values(languages).reduce((a, b) => a + b, 0) || 1;
  const sorted = Object.entries(languages).sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, TOP_LANGUAGES);
  const rest = sorted.slice(TOP_LANGUAGES).reduce((sum, [, bytes]) => sum + bytes, 0);
  if (rest > 0) top.push([OTHER_LANGUAGE, rest]);
  return top.map(([name, bytes]) => ({
    name,
    share: (bytes / total) * PERCENT,
    colour: LANGUAGE_COLOURS[name] ?? OTHER_COLOUR,
  }));
}

function card(stats, theme) {
  const t = THEMES[theme];
  const tiles = [
    [group(stats.repositories), 'repositories'],
    [group(stats.commits), 'commits'],
    [group(stats.mergedPullRequests), 'merged pull requests'],
    [group(stats.contributors), 'contributors'],
    [`v${stats.specVersion}`, 'spec version'],
    [group(stats.modules), 'modules'],
    [group(stats.vectors), 'shared test vectors'],
    [group(stats.stars), 'stars'],
  ];
  const tileWidth = (CARD_WIDTH - 2 * PADDING) / COLUMNS;
  const tileSvg = tiles
    .map(([value, label], i) => {
      const x = PADDING + (i % COLUMNS) * tileWidth;
      const y = TILE_TOP + Math.floor(i / COLUMNS) * TILE_ROW_HEIGHT + VALUE_SIZE;
      return `<text x="${x}" y="${y}" font-size="${VALUE_SIZE}" font-weight="700" fill="${t.text}">${escapeXml(value)}</text>`
        + `<text x="${x}" y="${y + LABEL_OFFSET}" font-size="${LABEL_SIZE}" fill="${t.muted}">${escapeXml(label)}</text>`;
    })
    .join('');

  const langs = topLanguages(stats.languages);
  const barWidth = CARD_WIDTH - 2 * PADDING;
  let cursor = PADDING;
  const segments = langs
    .map((l) => {
      const w = (l.share / PERCENT) * barWidth;
      const seg = `<rect x="${cursor.toFixed(2)}" y="${BAR_TOP}" width="${w.toFixed(2)}" height="${BAR_HEIGHT}" fill="${l.colour}"/>`;
      cursor += w;
      return seg;
    })
    .join('');
  let legendX = PADDING;
  const legend = langs
    .map((l) => {
      const label = `${l.name} ${l.share.toFixed(PERCENT_DECIMALS)}%`;
      const item = `<circle cx="${legendX + LEGEND_DOT}" cy="${LEGEND_BASELINE - LEGEND_DOT}" r="${LEGEND_DOT}" fill="${l.colour}"/>`
        + `<text x="${legendX + 3 * LEGEND_DOT}" y="${LEGEND_BASELINE}" font-size="${LABEL_SIZE}" fill="${t.muted}">${escapeXml(label)}</text>`;
      legendX += 3 * LEGEND_DOT + label.length * LEGEND_CHAR_WIDTH + LEGEND_GAP;
      return item;
    })
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${CARD_WIDTH}" height="${CARD_HEIGHT}" viewBox="0 0 ${CARD_WIDTH} ${CARD_HEIGHT}" font-family="${FONT}" role="img" aria-labelledby="title">
<title id="title">Mdgascar in numbers, updated ${stats.updated}</title>
<rect x="0.5" y="0.5" width="${CARD_WIDTH - 1}" height="${CARD_HEIGHT - 1}" rx="${CARD_RADIUS}" fill="${t.bg}" stroke="${t.border}"/>
<rect x="${PADDING}" y="${TITLE_BASELINE - TITLE_SIZE + 2}" width="4" height="${TITLE_SIZE}" rx="2" fill="${FLAG_RED}"/>
<rect x="${PADDING + 6}" y="${TITLE_BASELINE - TITLE_SIZE + 2}" width="4" height="${TITLE_SIZE}" rx="2" fill="${FLAG_GREEN}"/>
<text x="${PADDING + 18}" y="${TITLE_BASELINE}" font-size="${TITLE_SIZE}" font-weight="700" fill="${t.text}">Mdgascar in numbers</text>
<text x="${CARD_WIDTH - PADDING}" y="${TITLE_BASELINE}" font-size="${LABEL_SIZE}" fill="${t.muted}" text-anchor="end">updated ${stats.updated}</text>
${tileSvg}
<clipPath id="bar"><rect x="${PADDING}" y="${BAR_TOP}" width="${barWidth}" height="${BAR_HEIGHT}" rx="${BAR_RADIUS}"/></clipPath>
<rect x="${PADDING}" y="${BAR_TOP}" width="${barWidth}" height="${BAR_HEIGHT}" rx="${BAR_RADIUS}" fill="${t.track}"/>
<g clip-path="url(#bar)">${segments}</g>
${legend}
</svg>
`;
}

async function publish(files) {
  const repo = process.env.GITHUB_REPOSITORY ?? `${ORG}/.github`;
  const tree = [];
  for (const [path, content] of Object.entries(files)) {
    const { data: blob } = await request('POST', `/repos/${repo}/git/blobs`, { content, encoding: 'utf-8' });
    tree.push({ path, mode: FILE_MODE, type: 'blob', sha: blob.sha });
  }
  const { data: treeObj } = await request('POST', `/repos/${repo}/git/trees`, { tree });
  const { data: commit } = await request('POST', `/repos/${repo}/git/commits`, {
    message: 'chore: update profile stats',
    tree: treeObj.sha,
    parents: [],
  });
  const ref = `heads/${STATS_BRANCH}`;
  const { res } = await request('PATCH', `/repos/${repo}/git/refs/${ref}`, { sha: commit.sha, force: true });
  if (res.status === HTTP_NOT_FOUND || res.status === HTTP_UNPROCESSABLE) {
    const created = await request('POST', `/repos/${repo}/git/refs`, { ref: `refs/${ref}`, sha: commit.sha });
    if (!created.res.ok) throw new Error(`create ${ref}: ${created.res.status}`);
  } else if (!res.ok) {
    throw new Error(`update ${ref}: ${res.status}`);
  }
  console.log(`published ${commit.sha} to ${repo}@${STATS_BRANCH}`);
}

const [outDir, flag] = process.argv.slice(2);
if (!outDir) throw new Error('usage: profile-stats.mjs <out-dir> [--publish]');
const stats = await collect();
const files = {
  'stats-light.svg': card(stats, 'light'),
  'stats-dark.svg': card(stats, 'dark'),
  'stats.json': `${JSON.stringify(stats, null, 2)}\n`,
};
mkdirSync(outDir, { recursive: true });
for (const [name, content] of Object.entries(files)) writeFileSync(join(outDir, name), content);
console.log(JSON.stringify({ ...stats, languages: undefined }));
if (flag === PUBLISH_FLAG) await publish(files);

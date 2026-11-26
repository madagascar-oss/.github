<div align="center">

<img src="https://raw.githubusercontent.com/mdgascar/.github/main/profile/assets/banner.svg" alt="Mdgascar: open-source tools for Malagasy developers" width="100%">

<br>

[![Docs and playground](https://img.shields.io/badge/docs-playground-64c34f?style=flat-square&logo=astro&logoColor=white)](https://mdgascar.github.io/mdg-utils-docs/)
[![Spec version](https://img.shields.io/github/v/tag/mdgascar/mdg-utils-spec?label=spec&style=flat-square&color=e22b27)](https://github.com/mdgascar/mdg-utils-spec)
[![License: MIT](https://img.shields.io/badge/license-MIT-11141a?style=flat-square)](https://github.com/mdgascar/mdg-utils-spec/blob/dev/LICENSE)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-64c34f?style=flat-square)](https://github.com/mdgascar/.github/blob/main/CONTRIBUTING.md)
[![Made in Madagascar](https://img.shields.io/badge/made%20in-Madagascar%20%F0%9F%87%B2%F0%9F%87%AC-e22b27?style=flat-square)](https://github.com/mdgascar)

**Open source projects built by and for the Malagasy developer community.**<br>
Malagasy data done right: official sources, shared test vectors, one behaviour in every language.

</div>

## 📊 In numbers

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/mdgascar/.github/stats/stats-dark.svg">
  <img alt="Mdgascar in numbers: repositories, commits, merged pull requests, contributors, spec version, modules, shared test vectors, stars and languages" src="https://raw.githubusercontent.com/mdgascar/.github/stats/stats-light.svg" width="100%">
</picture>

<sub>Refreshed every day by the <a href="https://github.com/mdgascar/.github/blob/main/.github/workflows/profile-stats.yml">profile stats workflow</a>.</sub>

## 🧰 mdg-utils

Malagasy number words, Madagascar phone numbers, Ariary amounts and dates. Every port is built
from **one shared spec** with official sources and passes the **same test vectors**.

| Module | Example |
| --- | --- |
| **words** | `2026` → `enina amby roapolo sy roa arivo` |
| **phone** | `0341234567` → `+261 34 12 345 67` (Telma) |
| **ariary** | `1500.5` → `Ar 1 500,5` · `1500` → `dimanjato sy arivo ariary` |
| **date** | `2026-11-23` → `Alatsinainy 23 Novambra 2026` |

| Repository | What it is | CI |
| --- | --- | --- |
| 📐 [**mdg-utils-spec**](https://github.com/mdgascar/mdg-utils-spec) | Shared data, sources and test vectors: the contract | [![CI](https://github.com/mdgascar/mdg-utils-spec/actions/workflows/ci.yml/badge.svg)](https://github.com/mdgascar/mdg-utils-spec/actions/workflows/ci.yml) |
| 🟨 [**mdg-utils-js**](https://github.com/mdgascar/mdg-utils-js) | JavaScript and TypeScript, zero dependencies: `@mdgascar/*` | [![CI](https://github.com/mdgascar/mdg-utils-js/actions/workflows/ci.yml/badge.svg)](https://github.com/mdgascar/mdg-utils-js/actions/workflows/ci.yml) |
| 🐘 [**mdg-utils-php**](https://github.com/mdgascar/mdg-utils-php) | PHP 8.3+, zero dependencies: `mdgascar/mdg-utils` | [![CI](https://github.com/mdgascar/mdg-utils-php/actions/workflows/ci.yml/badge.svg)](https://github.com/mdgascar/mdg-utils-php/actions/workflows/ci.yml) |
| 📚 [**mdg-utils-docs**](https://github.com/mdgascar/mdg-utils-docs) | Docs and live playground in English, Malagasy and French | [![Deploy](https://github.com/mdgascar/mdg-utils-docs/actions/workflows/deploy.yml/badge.svg)](https://github.com/mdgascar/mdg-utils-docs/actions/workflows/deploy.yml) |

```ts
import { formatAriary, formatDate, formatPhoneNumber, numberToWords } from '@mdgascar/utils';

numberToWords(2026); // 'enina amby roapolo sy roa arivo'
formatAriary(1500); // 'Ar 1 500'
formatPhoneNumber('0341234567', 'international'); // '+261 34 12 345 67'
formatDate('2026-11-23', 'full'); // 'Alatsinainy 23 Novambra 2026'
```

```php
use Mdgascar\MdgUtils\Words\NumberWords;

NumberWords::fromInt(2026); // 'enina amby roapolo sy roa arivo'
```

<div align="center">

**[▶ Try it in your browser](https://mdgascar.github.io/mdg-utils-docs/)**, JavaScript and PHP, nothing to install.

</div>

## 🤝 Get involved

- 🧾 **No code needed:** fix data with a source, or add test vectors in [mdg-utils-spec](https://github.com/mdgascar/mdg-utils-spec)
- 🌱 Pick a [`good first issue`](https://github.com/search?q=org%3Amdgascar+label%3A%22good+first+issue%22+state%3Aopen&type=issues)
- 📖 Read the [contributing guide](https://github.com/mdgascar/.github/blob/main/CONTRIBUTING.md)
- 💬 Follow our [code of conduct](https://github.com/mdgascar/.github/blob/main/CODE_OF_CONDUCT.md)
- 🔐 Report vulnerabilities privately: see our [security policy](https://github.com/mdgascar/.github/blob/main/SECURITY.md)
- 🆕 Starting a new project? Use the [repo template](https://github.com/mdgascar/repo-template)

<div align="center">
<br>
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/mdgascar/.github/main/profile/assets/mark-dark.svg">
  <img src="https://raw.githubusercontent.com/mdgascar/.github/main/profile/assets/mark-light.svg" alt="" width="48">
</picture>
<br>
<sub><b>Misaotra betsaka!</b> Thank you for building with us.</sub>
</div>

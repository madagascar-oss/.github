# Mdgascar 🇲🇬

Open source projects built by and for the Malagasy developer community.

## Projects

### [mdg-utils](https://mdgascar.github.io/mdg-utils-docs/)

Malagasy number words, Madagascar phone numbers, Ariary amounts and dates. Every language
port is built from one shared spec with official sources and passes the same test vectors.

| Repository                                                   | What it is                                               | Package                           |
| ------------------------------------------------------------ | -------------------------------------------------------- | --------------------------------- |
| [mdg-utils-spec](https://github.com/mdgascar/mdg-utils-spec) | Shared data, sources and test vectors                    |                                   |
| [mdg-utils-js](https://github.com/mdgascar/mdg-utils-js)     | JavaScript and TypeScript port, zero dependencies        | `@mdgascar/*` on npm              |
| [mdg-utils-php](https://github.com/mdgascar/mdg-utils-php)   | PHP 8.3+ port, zero dependencies                         | `mdgascar/mdg-utils` on Packagist |
| [mdg-utils-docs](https://github.com/mdgascar/mdg-utils-docs) | Docs and live playground in English, Malagasy and French |                                   |

```ts
numberToWords(2026); // 'enina amby roapolo sy roa arivo'
formatAriary(1500); // 'Ar 1 500'
formatPhoneNumber("0341234567", "international"); // '+261 34 12 345 67'
formatDate("2026-11-23", "full"); // 'Alatsinainy 23 Novambra 2026'
```

**Try it in your browser:** [mdgascar.github.io/mdg-utils-docs](https://mdgascar.github.io/mdg-utils-docs/)

## Get involved

- 📖 Read the [contributing guide](https://github.com/mdgascar/.github/blob/main/CONTRIBUTING.md)
- 🧾 No code needed: fix data with a source, or add test vectors in [mdg-utils-spec](https://github.com/mdgascar/mdg-utils-spec)
- 🤝 Follow our [code of conduct](https://github.com/mdgascar/.github/blob/main/CODE_OF_CONDUCT.md)
- 🔐 Report vulnerabilities privately: see our [security policy](https://github.com/mdgascar/.github/blob/main/SECURITY.md)
- 🆕 Starting a new project? Use the [repo template](https://github.com/mdgascar/repo-template)

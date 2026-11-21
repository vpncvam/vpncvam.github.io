# vpncvam.github.io

Personal academic website of **Vipin Kumar**, doctoral researcher in cryptography at IIT Bhilai.

Live at **<https://vpncvam.github.io>**.

## Credits

This site is built on [**al-folio**](https://github.com/alshedivat/al-folio), a Jekyll template for academic websites created by
[Maruan Al-Shedivat](https://maruan.alshedivat.com) and maintained by its [contributors](https://github.com/alshedivat/al-folio/graphs/contributors).
al-folio is released under the MIT License; its copyright and permission notice are kept in [`LICENSE`](LICENSE).

The homepage design (lattice background, interactive Babai-rounding hero, single-page layout) is a customisation on top of al-folio,
added as new files so the template's own packages stay untouched:

| File                         | What it is                                                      |
| ---------------------------- | --------------------------------------------------------------- |
| `_layouts/home.liquid`       | Single-page homepage layout                                     |
| `_layouts/home_bib.liquid`   | Publication and patent entry template (used by jekyll-scholar)  |
| `_layouts/home_plain.liquid` | Simple page in the same design (404 page)                       |
| `assets/css/home.css`        | Styles for the above                                            |
| `assets/js/home.js`          | Lattice animation, typing tagline, nav highlight, BibTeX toggle |

Fonts: [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk), [Inter](https://fonts.google.com/specimen/Inter) and
[JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) via Google Fonts.

## Editing the content

| To change                                                    | Edit                                                    |
| ------------------------------------------------------------ | ------------------------------------------------------- |
| Name, title line and About text                              | `_pages/about.md`                                       |
| Projects, teaching, events, awards, contact, tagline phrases | `_data/home.yml`                                        |
| Publications / patents                                       | `_bibliography/papers.bib`, `_bibliography/patents.bib` |
| Google Scholar, GitHub, LinkedIn links                       | `_data/socials.yml`                                     |
| Site title, description, analytics (`goatcounter:`)          | `_config.yml`                                           |

Pushing to `main` builds the site with GitHub Actions (`.github/workflows/deploy.yml`) and publishes it to the `gh-pages` branch.

## Local preview

```bash
bundle config set --local path vendor/bundle
bundle install --jobs 1
bundle exec jekyll serve    # http://127.0.0.1:4000/
```

See al-folio's [`docs/`](docs/) for everything else the template supports.

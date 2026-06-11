# Deploy — GitHub Actions → GitHub Pages

## Configurazione repo GitHub

1. Vai su **Settings → Pages**
2. Source: **GitHub Actions**
3. Non serve branch `gh-pages` manuale

## astro.config.mjs — impostazioni deploy

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://USERNAME.github.io',
  base: '/REPO-NAME',   // ometti se è il repo principale (username.github.io)
  i18n: {
    defaultLocale: 'it',
    locales: ['it', 'en', 'fr'],
    routing: { prefixDefaultLocale: false },
  },
  build: {
    assets: '_astro',
  },
});
```

## .github/workflows/deploy.yml

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: lts/*
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## package.json — script minimi

```json
{
  "scripts": {
    "dev":     "astro dev",
    "build":   "astro build",
    "preview": "astro preview",
    "check":   "astro check"
  }
}
```

## .gitignore

```
dist/
node_modules/
.env
.env.*
.DS_Store
```

## Workflow locale → produzione

```bash
# Sviluppo
npm run dev

# Verifica TypeScript e template
npm run check

# Build locale e preview
npm run build && npm run preview

# Deploy: basta fare push su main
git push origin main
```

## Note su path con base

Se il sito è su `https://username.github.io/repo-name/`, tutti i link interni devono usare `import.meta.env.BASE_URL` come prefisso oppure i path relativi di Astro — non hardcodare `/`.

```astro
<!-- Corretto -->
<a href={`${import.meta.env.BASE_URL}${lang}/chi-siamo/`}>Chi siamo</a>

<!-- Oppure con routing Astro -->
<a href={`/${lang}/chi-siamo/`}>Chi siamo</a>
<!-- Astro aggiunge il base automaticamente nel build -->
```

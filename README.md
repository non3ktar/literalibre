# FlowWrite

Clone minimalista do [WriteFreely](https://writefreely.org) — blog estático com editor Markdown, pronto para **Netlify**, **GitHub Pages**, **Cloudflare Pages** e qualquer hospedagem de arquivos estáticos.

![Stack](https://img.shields.io/badge/React-19-61dafb)
![Vite](https://img.shields.io/badge/Vite-8-646cff)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8)

## Funcionalidades

- Interface minimalista, foco na escrita (estilo WriteFreely)
- Editor Markdown com prévia em tempo real
- Rascunhos e publicação com um clique
- Armazenamento local no navegador (IndexedDB via Dexie.js)
- Exportação/importação de `site.json` para deploy estático
- Posts de demonstração embutidos em `public/data/site.json`
- Dark mode elegante com glassmorphism
- Rotas com HashRouter — compatível com GitHub Pages sem configuração extra

## Tecnologias

- **React 19** + **TypeScript** + **Vite 8**
- **Tailwind CSS 4**
- **Dexie.js** (IndexedDB)
- **marked** + **DOMPurify** (Markdown seguro)
- **Radix UI** (diálogos, abas, alertas)
- **Lucide React** (ícones)

## Executar localmente

```bash
cd flowwrite
npm install
npm run dev
```

Abra `http://localhost:5173` (ou a porta indicada no terminal).

## Fluxo de publicação

1. Escreva posts em **Escrever** e publique.
2. Vá em **Config** → **Exportar site.json**.
3. Substitua o arquivo `public/data/site.json` pelo exportado.
4. Faça build e deploy:

```bash
npm run build
```

A pasta `dist/` contém o site pronto para hospedar.

## Deploy no Netlify

1. Conecte o repositório no [Netlify](https://netlify.com).
2. Build command: `npm run build`
3. Publish directory: `dist`
4. O arquivo `netlify.toml` já configura redirects para SPA.

Ou arraste a pasta `dist/` para o Netlify Drop.

## Deploy no GitHub Pages

1. Crie um repositório e envie o código.
2. Em **Settings → Pages**, escolha **GitHub Actions** como fonte.
3. O workflow `.github/workflows/deploy.yml` publica automaticamente em push na branch `main`.
4. Acesse `https://<usuario>.github.io/<repositorio>/`

> O `vite.config.ts` usa `base: './'` e `HashRouter` para funcionar em subpastas do GitHub Pages.

## Deploy no Cloudflare Pages

- Build command: `npm run build`
- Output directory: `dist`

## Estrutura do projeto

```
flowwrite/
├── public/
│   ├── data/site.json    # Posts estáticos (deploy)
│   └── _redirects        # Netlify SPA
├── src/
│   ├── components/       # UI reutilizável
│   ├── db/               # Dexie (IndexedDB)
│   ├── hooks/
│   ├── lib/              # Markdown, export, slug
│   ├── pages/
│   └── types/
├── netlify.toml
└── .github/workflows/deploy.yml
```

## Licença

MIT — use livremente em projetos educacionais.

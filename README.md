# Philippines Gold Rate Calculator

Vue.js app to compute **final gold jewelry price** in PHP:

**Formula:** `(gold rate × grams + making charge) + 12% tax`

## Features

- **User registration & login** (stored in browser)
- **Philippines gold rate** — default rates per gram for 24K, 22K, 21K, 18K, 14K, 10K (editable)
- **Per-purity calculators** — separate calculator per karat with its own rate
- **Professional green theme** UI

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (e.g. http://localhost:5173).

## Build

```bash
npm run build
```

Output is in `dist/`.

## Deploy to Netlify

The project includes `netlify.toml` so Netlify builds and serves the app correctly (including SPA routing).

### Option A: Deploy with Git (recommended)

1. Push this project to **GitHub**, **GitLab**, or **Bitbucket**.
2. Go to [netlify.com](https://www.netlify.com) → **Add new site** → **Import an existing project**.
3. Connect your Git provider and select this repository.
4. Netlify will use `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Click **Deploy site**. Future pushes to your main branch will auto-deploy.

### Option B: Deploy by drag-and-drop

1. Locally, run:
   ```bash
   npm install
   npm run build
   ```
2. In Netlify: **Add new site** → **Deploy manually**.
3. Drag the **`dist`** folder (created by `npm run build`) into the deploy area.
4. For direct URLs like `/login` or `/calculator` to work, add a redirect in Netlify:
   - **Site settings** → **Build & deploy** → **Post processing** → **Custom redirects**
   - Add: `/* /index.html 200`

Your site will be at `https://your-site-name.netlify.app`.

## Formula

1. **Gold value** = Gold rate (PHP/gram) × Grams  
2. **Subtotal** = Gold value + Making charge  
3. **Tax** = Subtotal × 12%  
4. **Final price** = Subtotal + Tax  

Rates are indicative; you can replace them with a live API (e.g. [GoldPricez](https://goldpricez.com/about/api)) later.

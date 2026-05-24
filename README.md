# ABSL Corporate Intel & Pitch Engine

Live AI-powered corporate treasury intelligence dashboard for ABSL AMC.

## Deploy in 5 minutes (free)

### Step 1 — Get your Anthropic API key
1. Go to https://console.anthropic.com
2. Sign up / log in
3. Click **API Keys** → **Create Key**
4. Copy the key (starts with `sk-ant-...`)

### Step 2 — Upload to GitHub
1. Go to https://github.com/new
2. Create a new repository called `absl-intel`
3. Upload all these files (drag and drop the folder)

### Step 3 — Deploy to Vercel (free)
1. Go to https://vercel.com and sign in with GitHub
2. Click **Add New Project**
3. Select your `absl-intel` repository → click **Deploy**
4. Go to **Settings → Environment Variables**
5. Add:
   - Name: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-your-key-here`
6. Click **Save** → then **Redeploy**

### Done! 🎉
Your dashboard is live at `https://absl-intel.vercel.app`

- Anyone can visit the link
- API key is secure on the server — never exposed
- Works for ANY Indian listed company
- No login required for users

## Local development

```bash
npm install
# Edit .env.local and add your API key
npm run dev
# Open http://localhost:3000
```

## Tech stack
- Next.js 14 (App Router)
- Anthropic Claude API (server-side, key never exposed)
- Pure CSS — no UI library needed
- Vercel for hosting (free tier works perfectly)

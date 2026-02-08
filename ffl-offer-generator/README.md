# FFL Offer Generator

AI-powered sales copy generator built for the firearms retail industry. Generates headlines, Facebook ads, email sequences, and landing page copy for FFL dealers and gun store owners.

## Quick Deploy to Vercel

### 1. Push to GitHub

```bash
# Create a new repo on GitHub, then:
git init
git add .
git commit -m "FFL Offer Generator"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/ffl-offer-generator.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Import your `ffl-offer-generator` repo
4. Before deploying, add your environment variable:
   - Click **"Environment Variables"**
   - Name: `ANTHROPIC_API_KEY`
   - Value: Your API key from [console.anthropic.com](https://console.anthropic.com)
5. Click **Deploy**

Your app will be live at `https://ffl-offer-generator.vercel.app` (or your custom domain).

### 3. Custom Domain (Optional)

In Vercel dashboard → Settings → Domains → Add your domain (e.g., `offergenerator.fflfunnels.com`)

## Local Development

```bash
# Install dependencies
npm install

# Copy env file and add your API key
cp .env.local.example .env.local

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Cost

Each generation costs roughly $0.01-0.05 depending on the copy type selected. The app uses Claude Sonnet 4 via the Anthropic API.

## Tech Stack

- Next.js 14 (App Router)
- React 18
- Anthropic Claude API (server-side, key never exposed to browser)
- Vercel for hosting

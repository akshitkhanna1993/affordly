# 🚀 GitHub Pages Deployment - Quick Steps

Follow these steps to deploy Affordly to GitHub Pages.

---

## Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com) → Click **"+"** → **"New repository"**
2. Name: `affordly` (or your preferred name)
3. Make it **Public** (required for free GitHub Pages)
4. **Don't** initialize with README
5. Click **"Create repository"**

---

## Step 2: Update Repository Name in Config

**IMPORTANT:** If your repository name is NOT "affordly", update `vite.config.ts`:

Open `vite.config.ts` and change:
```typescript
base: process.env.NODE_ENV === "production" ? "/affordly/" : "/",
```

Replace `"/affordly/"` with `"/YOUR_REPO_NAME/"`

**Example:** If repo is `my-affordly-app`, change to `"/my-affordly-app/"`

---

## Step 3: Push Code to GitHub

```bash
# If Git is not initialized
git init
git add .
git commit -m "Initial commit"

# Connect to GitHub (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/affordly.git
git branch -M main
git push -u origin main
```

---

## Step 4: Install gh-pages

```bash
npm install
```

(This will install `gh-pages` which is already added to package.json)

---

## Step 5: Deploy

```bash
npm run deploy
```

This will:
- Build your app
- Create `gh-pages` branch
- Deploy to GitHub Pages

---

## Step 6: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **"Settings"** → **"Pages"** (left sidebar)
3. Under **"Source"**:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
4. Click **"Save"**

---

## Step 7: Access Your Site

Wait 1-2 minutes, then visit:
```
https://YOUR_USERNAME.github.io/affordly/
```

**Example:** `https://johndoe.github.io/affordly/`

---

## ✅ Done!

Your app is now live on GitHub Pages!

---

## 🔄 To Update Your Site

```bash
# Make changes, then:
git add .
git commit -m "Your changes"
git push
npm run deploy
```

---

## 🐛 Troubleshooting

**404 Error?** → Check `base` path in `vite.config.ts` matches your repo name

**Assets not loading?** → Clear browser cache, wait a few minutes

**Site not showing?** → Check GitHub Pages is enabled in Settings → Pages

---

**Need detailed help?** See [docs/GITHUB_PAGES_DEPLOYMENT.md](./docs/GITHUB_PAGES_DEPLOYMENT.md)

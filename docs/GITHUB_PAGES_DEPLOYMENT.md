# GitHub Pages Deployment Guide

Complete step-by-step guide to deploy Affordly to GitHub Pages.

---

## 📋 Prerequisites

- GitHub account
- Git installed on your computer
- Node.js (v18+) installed

---

## 🚀 Step-by-Step Instructions

### Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **"+"** icon → **"New repository"**
3. Fill in:
   - **Repository name**: `affordly` (or your preferred name)
   - **Description**: "Personal financial gatekeeper web app"
   - **Visibility**: Choose Public (required for free GitHub Pages) or Private (requires GitHub Pro)
   - **DO NOT** initialize with README, .gitignore, or license
4. Click **"Create repository"**

---

### Step 2: Initialize Git (if not already done)

If you haven't initialized Git in your project:

```bash
cd /Users/akshitkhanna/Desktop/affordly
git init
git add .
git commit -m "Initial commit"
```

---

### Step 3: Connect to GitHub Repository

```bash
# Replace YOUR_USERNAME with your GitHub username
# Replace affordly with your repository name if different

git remote add origin https://github.com/YOUR_USERNAME/affordly.git
git branch -M main
git push -u origin main
```

**Example:**
```bash
git remote add origin https://github.com/johndoe/affordly.git
git branch -M main
git push -u origin main
```

---

### Step 4: Install gh-pages Package

```bash
npm install --save-dev gh-pages
```

---

### Step 5: Update Configuration Files

#### 5a. Update `vite.config.ts`

The base path needs to match your repository name. Update the file:

```typescript
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/affordly/", // Replace 'affordly' with your repository name
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 3000,
  },
  build: {
    outDir: "dist",
  },
});
```

**Important:** Replace `/affordly/` with `/YOUR_REPO_NAME/` if your repository has a different name.

#### 5b. Update `package.json`

Add the deploy script:

```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

---

### Step 6: Build and Deploy

```bash
# Build the app
npm run build

# Deploy to GitHub Pages
npm run deploy
```

This will:
1. Build your app
2. Create a `gh-pages` branch
3. Push the `dist` folder to GitHub Pages

---

### Step 7: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **"Settings"** (top menu)
3. Scroll down to **"Pages"** (left sidebar)
4. Under **"Source"**, select:
   - **Branch**: `gh-pages`
   - **Folder**: `/ (root)`
5. Click **"Save"**

---

### Step 8: Wait for Deployment

- GitHub Pages takes 1-2 minutes to deploy
- You'll see a green checkmark when deployment is complete
- Your site URL will be: `https://YOUR_USERNAME.github.io/affordly/`

**Example:** `https://johndoe.github.io/affordly/`

---

### Step 9: Test Your Live Site

1. Visit your GitHub Pages URL
2. Test all features:
   - Profile setup
   - Item evaluation
   - Results display
   - localStorage functionality

---

## 🔄 Updating Your Site

Every time you make changes:

```bash
# Make your changes, then:
git add .
git commit -m "Your commit message"
git push origin main

# Deploy updates
npm run deploy
```

---

## 🐛 Troubleshooting

### Issue: 404 on page refresh

**Solution:** Make sure the `base` path in `vite.config.ts` matches your repository name exactly (including the leading and trailing slashes).

### Issue: Assets not loading

**Solution:** 
1. Check `base` path is correct
2. Clear browser cache
3. Wait a few minutes for GitHub Pages to update

### Issue: "gh-pages: command not found"

**Solution:** 
```bash
npm install --save-dev gh-pages
```

### Issue: Site shows "404 Not Found"

**Solution:**
1. Check GitHub Pages is enabled in Settings
2. Verify `gh-pages` branch exists
3. Wait 5-10 minutes for initial deployment

### Issue: Router not working

**Solution:** Ensure `base` path in `vite.config.ts` matches your repo name. The router should automatically use this base path.

---

## 📝 Important Notes

1. **Repository Name**: The `base` path in `vite.config.ts` must match your repository name exactly
2. **Public Repository**: Free GitHub Pages requires a public repository (or GitHub Pro for private)
3. **Custom Domain**: You can add a custom domain later in Pages settings
4. **HTTPS**: GitHub Pages automatically provides HTTPS
5. **Build Time**: Each deployment takes 1-2 minutes

---

## 🎯 Quick Reference

```bash
# Initial setup (one time)
npm install --save-dev gh-pages
# Update vite.config.ts base path
# Update package.json with deploy script

# Deploy
npm run deploy

# Update site
git add .
git commit -m "Update"
git push
npm run deploy
```

---

## ✅ Checklist

- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] `gh-pages` package installed
- [ ] `vite.config.ts` base path updated
- [ ] `package.json` deploy script added
- [ ] `npm run deploy` executed successfully
- [ ] GitHub Pages enabled in Settings
- [ ] Site accessible at `https://USERNAME.github.io/REPO_NAME/`
- [ ] All features tested on live site

---

**Your app is now live on GitHub Pages! 🎉**

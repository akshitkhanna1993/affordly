# Deployment Guide

This guide covers multiple deployment options for the Affordly web app. Choose the option that best fits your needs.

---

## 🚀 Quick Deployment Options

| Platform | Difficulty | Cost | Best For |
|----------|-----------|------|----------|
| **Vercel** | ⭐ Easy | Free | Production apps, automatic deployments |
| **Netlify** | ⭐ Easy | Free | Static sites, form handling |
| **Cloudflare Pages** | ⭐ Easy | Free | Fast global CDN |
| **GitHub Pages** | ⭐⭐ Medium | Free | Open source projects |
| **VPS/Server** | ⭐⭐⭐ Hard | Paid | Full control, custom domains |

---

## Option 1: Vercel (Recommended) ⭐

Vercel is the easiest and most popular option for Vue apps with automatic deployments.

### Prerequisites
- GitHub, GitLab, or Bitbucket account
- Code pushed to a repository

### Steps

1. **Build the app locally (test first):**
   ```bash
   npm run build
   ```

2. **Install Vercel CLI (optional, can use web UI):**
   ```bash
   npm install -g vercel
   ```

3. **Deploy via Web UI:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub/GitLab/Bitbucket
   - Click "Add New Project"
   - Import your repository
   - Configure:
     - **Framework Preset**: Vite
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`
   - Click "Deploy"

4. **Deploy via CLI (alternative):**
   ```bash
   vercel
   ```
   - Follow the prompts
   - First deployment will ask for configuration

5. **Configure Environment Variables (if needed):**
   - Go to Project Settings → Environment Variables
   - Add any required variables

6. **Your app is live!**
   - Vercel provides a URL like: `affordly.vercel.app`
   - Custom domains can be added in Project Settings

### Automatic Deployments
- Every push to `main` branch = Production deployment
- Every pull request = Preview deployment

---

## Option 2: Netlify ⭐

Netlify is another excellent option with great Vue support.

### Steps

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Install Netlify CLI (optional):**
   ```bash
   npm install -g netlify-cli
   ```

3. **Deploy via Web UI:**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/Login with GitHub/GitLab/Bitbucket
   - Click "Add New Site" → "Import an existing project"
   - Connect your repository
   - Configure:
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`
     - **Base directory**: (leave empty)
   - Click "Deploy site"

4. **Deploy via CLI (alternative):**
   ```bash
   netlify deploy --prod --dir=dist
   ```
   - First time: `netlify login` and `netlify init`

5. **Your app is live!**
   - Netlify provides a URL like: `affordly.netlify.app`
   - Custom domains can be added in Site Settings

### Netlify Configuration File (Optional)

Create `netlify.toml` in project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Option 3: Cloudflare Pages ⭐

Cloudflare Pages offers fast global CDN and free hosting.

### Steps

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Deploy via Web UI:**
   - Go to [pages.cloudflare.com](https://pages.cloudflare.com)
   - Sign up/Login with Cloudflare account
   - Click "Create a project" → "Connect to Git"
   - Connect your repository
   - Configure:
     - **Framework preset**: Vite
     - **Build command**: `npm run build`
     - **Build output directory**: `dist`
   - Click "Save and Deploy"

3. **Your app is live!**
   - Cloudflare provides a URL like: `affordly.pages.dev`
   - Custom domains can be added in Project Settings

---

## Option 4: GitHub Pages ⭐⭐

Free hosting for public repositories.

### Steps

1. **Install gh-pages package:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add deploy script to `package.json`:**
   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     }
   }
   ```

3. **Update `vite.config.ts` for GitHub Pages:**
   ```typescript
   export default defineConfig({
     base: '/affordly/', // Replace 'affordly' with your repo name
     // ... rest of config
   });
   ```

4. **Deploy:**
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Source: `gh-pages` branch
   - Save

6. **Your app is live!**
   - URL: `https://yourusername.github.io/affordly/`

---

## Option 5: Traditional VPS/Server ⭐⭐⭐

For full control and custom infrastructure.

### Steps

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Upload `dist` folder to server:**
   ```bash
   scp -r dist/* user@your-server.com:/var/www/affordly/
   ```

3. **Configure web server (Nginx example):**
   ```nginx
   server {
       listen 80;
       server_name affordly.com;
       root /var/www/affordly;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

4. **Set up SSL (Let's Encrypt):**
   ```bash
   certbot --nginx -d affordly.com
   ```

---

## 🔧 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] **Build succeeds locally:**
  ```bash
  npm run build
  ```

- [ ] **All tests pass:**
  ```bash
  npm run test:run
  ```

- [ ] **No linting errors:**
  ```bash
  npm run lint
  ```

- [ ] **Environment variables configured** (if any)

- [ ] **Base path configured** (for GitHub Pages or subdirectory)

- [ ] **404 handling** - Vue Router needs redirect to `index.html`

- [ ] **HTTPS enabled** (most platforms do this automatically)

---

## 📝 Post-Deployment Steps

1. **Test the live site:**
   - Verify all pages load correctly
   - Test form submissions
   - Check localStorage functionality
   - Test on mobile devices

2. **Set up custom domain (optional):**
   - Add domain in platform settings
   - Update DNS records
   - Wait for SSL certificate

3. **Monitor performance:**
   - Check page load times
   - Monitor error logs
   - Set up analytics (if needed)

4. **Set up continuous deployment:**
   - Connect Git repository
   - Configure auto-deploy on push
   - Set up preview deployments for PRs

---

## 🐛 Common Issues & Solutions

### Issue: 404 on page refresh
**Solution:** Configure redirect to `index.html` (SPA routing)

**Vercel:** Add `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Netlify:** Add `netlify.toml`:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Issue: Assets not loading
**Solution:** Check `base` path in `vite.config.ts` matches deployment path

### Issue: Build fails
**Solution:** 
- Check Node.js version (should be 18+)
- Clear `node_modules` and reinstall
- Check for TypeScript errors

### Issue: localStorage not working
**Solution:** Ensure HTTPS is enabled (localStorage requires secure context)

---

## 🔒 Security Considerations

1. **HTTPS:** Always use HTTPS (most platforms enable automatically)
2. **Environment Variables:** Never commit secrets to repository
3. **Content Security Policy:** Configure CSP headers if needed
4. **CORS:** Configure if using external APIs

---

## 📊 Performance Optimization

1. **Enable compression:** Most platforms do this automatically
2. **CDN:** Use platform's CDN (Vercel, Netlify, Cloudflare all have CDN)
3. **Caching:** Configure cache headers for static assets
4. **Code splitting:** Vite handles this automatically

---

## 🎯 Recommended: Vercel

For Affordly, **Vercel is recommended** because:
- ✅ Zero configuration needed
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Automatic deployments
- ✅ Preview deployments for PRs
- ✅ Free tier is generous
- ✅ Great Vue/Vite support

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages)
- [GitHub Pages Docs](https://docs.github.com/pages)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

---

**Ready to deploy? Start with Option 1 (Vercel) for the easiest experience!** 🚀

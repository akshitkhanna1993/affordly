# 🚀 Quick Deployment Checklist

## Pre-Deployment

- [ ] Code is committed and pushed to Git repository
- [ ] Build succeeds locally: `npm run build`
- [ ] All tests pass: `npm run test:run`
- [ ] No linting errors: `npm run lint`
- [ ] Tested locally: `npm run dev` works correctly
- [ ] Reviewed all features work as expected

## Deployment Steps (Vercel - Recommended)

1. [ ] Go to [vercel.com](https://vercel.com) and sign up/login
2. [ ] Click "Add New Project"
3. [ ] Import your Git repository
4. [ ] Configure:
   - [ ] Framework Preset: **Vite**
   - [ ] Build Command: `npm run build`
   - [ ] Output Directory: `dist`
   - [ ] Install Command: `npm install`
5. [ ] Click "Deploy"
6. [ ] Wait for deployment to complete
7. [ ] Copy the deployment URL

## Post-Deployment

- [ ] Test the live site loads correctly
- [ ] Test profile setup form
- [ ] Test item evaluation form
- [ ] Test results display
- [ ] Test localStorage persistence
- [ ] Test on mobile device
- [ ] Test all navigation links
- [ ] Verify HTTPS is enabled
- [ ] Check page load speed

## Optional: Custom Domain

- [ ] Add custom domain in Vercel settings
- [ ] Update DNS records
- [ ] Wait for SSL certificate
- [ ] Test custom domain works

## Done! 🎉

Your app is now live!

---

**Quick Commands:**
```bash
# Test build locally
npm run build

# Preview production build
npm run preview

# Run tests
npm run test:run

# Check code quality
npm run lint
```

---

**Need help?** See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed instructions.

# Deployment Guide - Shader Showcase

## 🚀 Quick Deploy to GitHub Pages

### Prerequisites
- GitHub account
- Git installed locally
- pnpm installed

### Step 1: Update Configuration

Replace `yourname` in the following files with your GitHub username:

**vite.config.ts:**
```ts
base: '/shader-showcase/', // Or your actual repo name
```

**README.md:**
```md
👉 [View Live Demo](https://YOUR-USERNAME.github.io/shader-showcase)
```

### Step 2: Create GitHub Repository

```bash
# Initialize git (if not already done)
git init

# Create repository on GitHub (via web interface or gh cli)
# Name it: shader-showcase

# Add remote
git remote add origin https://github.com/YOUR-USERNAME/shader-showcase.git
```

### Step 3: Push to GitHub

```bash
# Add all files
git add .

# Commit
git commit -m "Initial commit: Shader showcase with 7 demos"

# Push to main branch
git push -u origin main
```

### Step 4: Enable GitHub Pages

#### Method A: Manual Deploy
```bash
pnpm deploy
```

This will:
1. Build the project
2. Deploy to `gh-pages` branch
3. Your site will be live at: `https://YOUR-USERNAME.github.io/shader-showcase`

#### Method B: Automatic Deploy (Recommended)

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Build and deployment":
   - Source: **GitHub Actions**
4. Push to main branch → automatic deployment!

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will:
- Automatically build on every push to main
- Deploy to GitHub Pages
- Show deployment status in Actions tab

### Step 5: Verify Deployment

Visit: `https://YOUR-USERNAME.github.io/shader-showcase`

You should see:
- ✅ All 7 shader demos
- ✅ Interactive controls
- ✅ Smooth navigation
- ✅ Mobile-responsive design

## 🔧 Troubleshooting

### Issue: White screen / 404 errors

**Check base path in vite.config.ts:**
```ts
base: '/shader-showcase/', // Must match repo name exactly
```

**If your repo is named differently:**
```ts
base: '/your-actual-repo-name/',
```

### Issue: Shaders not loading

**Check GLSL imports:**
```tsx
import vertexShader from './vertex.glsl?raw'  // ✅ Correct
import vertexShader from './vertex.glsl'      // ❌ Wrong
```

**Verify Vite config:**
```ts
assetsInclude: ['**/*.glsl'], // Should be present
```

### Issue: Build fails

**Clear cache and rebuild:**
```bash
rm -rf node_modules/.vite-temp
rm -rf dist
pnpm install
pnpm build
```

### Issue: Leva controls not appearing

**Check package.json:**
```json
"dependencies": {
  "leva": "^0.9.35", // Must be present
}
```

**Reinstall if missing:**
```bash
pnpm add leva
```

## 🌐 Alternative Deployment Options

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts
```

No configuration needed! Vercel auto-detects Vite.

### Netlify

**Option 1: Drag & Drop**
1. Run `pnpm build`
2. Drag `dist` folder to Netlify

**Option 2: CLI**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Option 3: GitHub Integration**
- Connect repository
- Build command: `pnpm build`
- Publish directory: `dist`

### Cloudflare Pages

1. Connect GitHub repository
2. Build command: `pnpm build`
3. Output directory: `dist`
4. Deploy!

## 📊 Performance Optimization for Production

### Enable Gzip Compression

Most hosts enable this automatically, but verify:
- GitHub Pages: ✅ Auto-enabled
- Vercel: ✅ Auto-enabled
- Netlify: ✅ Auto-enabled

### Add CDN

For faster global delivery, consider:
- Cloudflare (free tier available)
- AWS CloudFront
- Fastly

### Monitor Performance

Use these tools:
- **Lighthouse** (Chrome DevTools)
- **WebPageTest** (webpagetest.org)
- **GTmetrix** (gtmetrix.com)

Target scores:
- Performance: >90
- Accessibility: >95
- Best Practices: >90

## 🔐 Security

### Content Security Policy (Optional)

Add to `index.html`:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-eval'; 
               style-src 'self' 'unsafe-inline';">
```

### HTTPS

All modern hosting platforms provide free HTTPS:
- ✅ GitHub Pages
- ✅ Vercel
- ✅ Netlify
- ✅ Cloudflare Pages

## 📈 Analytics (Optional)

### Add Google Analytics

1. Get GA4 tracking ID
2. Add to `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Alternative: Plausible Analytics

Privacy-friendly, lightweight analytics:
```html
<script defer data-domain="yourdomain.com" 
        src="https://plausible.io/js/script.js"></script>
```

## 🎉 Post-Deployment Checklist

- [ ] Site loads correctly
- [ ] All 7 shaders work
- [ ] Interactive controls functional
- [ ] Mobile-responsive
- [ ] No console errors
- [ ] Fast load time (<3s)
- [ ] Updated README with live link
- [ ] Added to portfolio
- [ ] Shared on social media!

## 🔄 Continuous Deployment

With GitHub Actions, every push to `main` will:
1. ✅ Run tests (if any)
2. ✅ Build the project
3. ✅ Deploy to GitHub Pages
4. ✅ Update live site

**Workflow status:**
- Check the **Actions** tab on GitHub
- Green ✅ = successful deploy
- Red ❌ = check logs for errors

## 📱 Testing on Different Devices

Before going live, test on:
- [ ] Desktop (Chrome, Firefox, Safari)
- [ ] Mobile (iOS Safari, Android Chrome)
- [ ] Tablet
- [ ] Different screen sizes

Use browser DevTools device emulation for quick testing.

## 🎨 Custom Domain (Optional)

### GitHub Pages

1. Buy domain (Namecheap, Google Domains, etc.)
2. Add CNAME file to repository root:
   ```
   yourdomain.com
   ```
3. Configure DNS:
   - Add A records to GitHub's IPs
   - Or CNAME to `YOUR-USERNAME.github.io`
4. Enable HTTPS in GitHub settings

### Vercel

1. Go to project settings
2. Domains → Add Domain
3. Follow DNS instructions
4. Automatic HTTPS!

---

## 🚀 You're Live!

Congratulations! Your shader showcase is now deployed and accessible worldwide.

**Share your creation:**
- Twitter/X with #WebGL #CreativeCoding
- Reddit: r/webdev, r/proceduralgeneration
- Dev.to article about your experience
- LinkedIn portfolio update

**Keep improving:**
- Add more shader effects
- Optimize performance
- Add tutorials/explanations
- Create video demos

Happy showcasing! 🎨✨

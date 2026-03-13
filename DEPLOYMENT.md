# Deployment Guide

## Dr.C - Fractal Explorer - (L-Systems)

This document explains how to deploy the Fractal Explorer to Netlify and GitHub.

---

## 📦 Project Status

✅ **Complete and Ready to Deploy!**

### What's Included

**Application Files:**

- `app.html` - Main application (~4500 lines, single-file)
- `index.html` - Landing page with feature overview
- 57 factory presets embedded in app.html

**Documentation:**

- `README.md` - GitHub repository overview
- `QUICKSTART.md` - User guide (5-minute tutorial)
- `TECHNICAL.md` - Developer documentation (architecture, Csound details, extending)

**Configuration:**

- `.gitignore` - Git ignore rules
- `netlify.toml` - Netlify deployment config

**Git Repository:**

- Initialized with `git init`
- Initial commit created
- Clean working directory

---

## 🚀 Deploy to Netlify

### Option 1: Netlify CLI (Recommended)

**Step 1: Install Netlify CLI**

```bash
npm install -g netlify-cli
```

**Step 2: Login to Netlify**

```bash
cd /Users/richardboulanger/dB-Studio/Dr.C/fractal-music-explorer
netlify login
```

**Step 3: Deploy**

```bash
# Deploy to a draft URL (for testing)
netlify deploy

# When ready, deploy to production
netlify deploy --prod
```

**Step 4: Configure Settings**

- Build command: (leave empty - static site)
- Publish directory: `.` (root directory)
- Production branch: `main`

### Option 2: Netlify Web UI

**Step 1: Push to GitHub First** (see GitHub section below)

**Step 2: Connect to Netlify**

1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select `fractal-explorer` repository
4. Configure:
   - Branch: `main`
   - Build command: (leave empty)
   - Publish directory: `.`
5. Click "Deploy site"

**Step 3: Custom Domain (Optional)**

1. Go to Site settings → Domain management
2. Add custom domain: `fractal-explorer.yourdomain.com`
3. Follow Netlify's DNS instructions

---

## 🐙 Deploy to GitHub

### Step 1: Create GitHub Repository

**Via GitHub Web UI:**

1. Go to [https://github.com/new](https://github.com/new)
2. Repository name: `fractal-explorer`
3. Description: "Dr.C - Fractal Explorer - L-System Sonification with Csound WASM 7"
4. Visibility: Public
5. **DO NOT** initialize with README (we already have one)
6. Click "Create repository"

### Step 2: Push to GitHub

```bash
cd /Users/richardboulanger/dB-Studio/Dr.C/fractal-music-explorer

# Add GitHub remote
git remote add origin https://github.com/rboulanger/fractal-explorer.git

# Push to GitHub
git push -u origin main
```

### Step 3: Configure GitHub Pages (Optional)

If you want to host on GitHub Pages instead of Netlify:

1. Go to repository Settings → Pages
2. Source: Deploy from a branch
3. Branch: `main` / folder: `/ (root)`
4. Click Save

Your site will be available at: `https://rboulanger.github.io/fractal-explorer/`

**Note:** Netlify is recommended over GitHub Pages for:

- Automatic HTTPS
- Custom domain support
- Faster CDN
- Better caching control
- Deploy previews for pull requests

---

## 🔗 URLs After Deployment

### Netlify URLs

**Automatic Netlify URL:**

- `https://[random-name].netlify.app/`
- Example: `https://fractal-explorer-drc.netlify.app/`

**Custom Domain (if configured):**

- `https://fractal-explorer.yourdomain.com/`

**Endpoints:**

- Landing page: `/` or `/index.html`
- Main app: `/app.html`
- Documentation: `/QUICKSTART.md`, `/TECHNICAL.md`

### GitHub URLs

**Repository:**

- `https://github.com/rboulanger/fractal-explorer`

**GitHub Pages (if enabled):**

- `https://rboulanger.github.io/fractal-explorer/`

---

## ✅ Pre-Deployment Checklist

- [x] App tested and working locally
- [x] 57 factory presets loading correctly
- [x] Master volume control working
- [x] Reverb mapping working
- [x] All documentation complete
- [x] Git repository initialized
- [x] .gitignore configured
- [x] netlify.toml created
- [x] Initial commit created
- [ ] GitHub repository created (DO THIS NEXT)
- [ ] Code pushed to GitHub
- [ ] Netlify deployment configured

---

## 🧪 Testing After Deployment

### 1. Landing Page

- [ ] Visit root URL → index.html loads
- [ ] Click "LAUNCH APPLICATION" → app.html loads
- [ ] Click "QUICK START GUIDE" → QUICKSTART.md loads
- [ ] Click "TECHNICAL DOCS" → TECHNICAL.md loads

### 2. Main Application

- [ ] App loads without errors (check browser console)
- [ ] Csound WASM loads successfully
- [ ] Click "LOAD FACTORY (57)" → 57 presets load
- [ ] Select preset and click LOAD → preset applies
- [ ] Click PLAY → audio plays
- [ ] Visualization shows fractal and playback cursor
- [ ] Master volume slider works in real-time
- [ ] Reverb sliders work in real-time
- [ ] STOP button works
- [ ] Save custom preset → loads correctly
- [ ] Auto-play on load checkbox works

### 3. Performance

- [ ] App loads in < 5 seconds on good connection
- [ ] Csound initializes in < 3 seconds
- [ ] No audio glitches or dropouts
- [ ] Visualization runs smoothly
- [ ] Works on Chrome, Firefox, Safari, Edge
- [ ] Works on desktop (recommended) and tablet

### 4. Documentation

- [ ] README displays correctly on GitHub
- [ ] Quick Start Guide is readable and accurate
- [ ] Technical docs are complete and accurate
- [ ] All links work (internal and external)

---

## 🐛 Troubleshooting Deployment

### Netlify Issues

**"Site not found" or 404 errors:**

- Check publish directory is set to `.` (root)
- Check netlify.toml is in repository root
- Check files were committed and pushed

**HTTPS certificate errors:**

- Wait 5-10 minutes for Netlify to provision certificate
- Check DNS is configured correctly (if using custom domain)

**Assets not loading:**

- Check file paths are relative (not absolute)
- Check browser console for CORS errors
- Verify CDN URLs are correct (Csound WASM from jsdelivr)

### GitHub Issues

**Push rejected:**

```bash
# If remote already has commits, pull first
git pull origin main --rebase
git push origin main
```

**Large files:**

- app.html is ~170KB (well within GitHub limits)
- No binary files or large assets
- Should not encounter size issues

**Authentication:**

```bash
# If using HTTPS, you may need a personal access token
# Go to GitHub Settings → Developer settings → Personal access tokens
# Generate token with 'repo' scope
# Use token as password when pushing
```

### Browser Console Errors

**"Failed to load Csound WASM":**

- Check internet connection (loads from jsdelivr CDN)
- Try hard refresh (Cmd+Shift+R or Ctrl+Shift+F5)
- Check browser console for specific error message

**"localStorage quota exceeded":**

- Clear browser data for the site
- Reduce number of custom presets
- 57 factory presets should be fine (~57KB)

---

## 📊 Analytics Setup (Optional)

### Google Analytics

Add to `app.html` and `index.html` before `</head>`:

```html
<!-- Google Analytics -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "GA_MEASUREMENT_ID");
</script>
```

### Netlify Analytics

1. Go to your site in Netlify
2. Click "Analytics" in sidebar
3. Enable Netlify Analytics ($9/month)
4. View traffic, bandwidth, and performance metrics

---

## 🔐 Security Headers

Already configured in `netlify.toml`:

- `X-Frame-Options: SAMEORIGIN` - Prevent clickjacking
- `X-Content-Type-Options: nosniff` - Prevent MIME sniffing
- `X-XSS-Protection: 1; mode=block` - XSS protection
- `Referrer-Policy: strict-origin-when-cross-origin` - Control referrer info

---

## 📈 Performance Optimization

### Already Implemented

- Single-file architecture (minimal HTTP requests)
- CDN-based Csound WASM (cached globally)
- HTML5 Canvas (hardware-accelerated)
- localStorage for presets (no database queries)
- Efficient JavaScript scheduling

### Future Optimizations

- [ ] Service worker for offline support
- [ ] Lazy-load documentation (on-demand)
- [ ] Compress HTML/CSS/JS (Netlify does this automatically)
- [ ] WebAssembly caching strategy

---

## 🎉 Post-Deployment

### Share Your Work!

**Social Media:**

- Twitter/X: Share URL with #DrCFractalExplorer #Csound #AlgorithmicMusic
- Reddit: Post to r/Csound, r/algorithmicmusic, r/fractals
- Discord: Share in Csound Discord server

**Community:**

- Submit to Csound Journal
- Present at Csound Conference
- Add to Awesome Csound list on GitHub

**Documentation:**

- Update README with live URL
- Add screenshots/videos to repository
- Create tutorial videos

---

## 📞 Support

**Deployment Issues:**

- Netlify Community Forum: [https://answers.netlify.com](https://answers.netlify.com)
- Netlify Docs: [https://docs.netlify.com](https://docs.netlify.com)

**GitHub Issues:**

- GitHub Docs: [https://docs.github.com](https://docs.github.com)
- GitHub Community: [https://github.community](https://github.community)

**Application Issues:**

- Open issue on GitHub: `https://github.com/rboulanger/fractal-explorer/issues`
- Check browser console for errors
- Review TECHNICAL.md for debugging tips

---

## 🎵 Next Steps

1. **Push to GitHub** (if not done yet)
2. **Deploy to Netlify** via CLI or web UI
3. **Test thoroughly** using checklist above
4. **Share with community**
5. **Gather feedback**
6. **Iterate and improve**

**Ready to deploy?** Run these commands:

```bash
cd /Users/richardboulanger/dB-Studio/Dr.C/fractal-music-explorer

# Create GitHub repo first (via web UI), then:
git remote add origin https://github.com/rboulanger/fractal-explorer.git
git push -u origin main

# Then deploy to Netlify:
netlify login
netlify deploy --prod
```

---

**Dr.C - Fractal Explorer - (L-Systems)**  
Created by Richard Boulanger • Powered by Csound WASM 7  
Deployment Guide v1.0

# Deployment Guide

This Stock Investment Calculator is now a lightweight, database-free application that can be deployed to any static hosting service. Here are several deployment options:

## 🚀 Quick Deployment Options

### 1. Netlify (Recommended)
**Easy drag-and-drop deployment:**
1. Go to [netlify.com](https://netlify.com)
2. Drag the `public` folder to the deploy area
3. Your app will be live instantly with a custom URL

**Git-based deployment:**
1. Connect your GitHub repository to Netlify
2. Set build directory to `public`
3. Auto-deploy on every push

### 2. Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project root
3. Follow the prompts
4. Your app will be deployed with a custom domain

### 3. GitHub Pages
1. Go to your repository settings
2. Navigate to "Pages" section
3. Set source to "Deploy from a branch"
4. Select your branch and `/public` folder
5. Save and wait for deployment

### 4. AWS S3 + CloudFront
1. Create an S3 bucket
2. Enable static website hosting
3. Upload contents of `public` folder
4. Optionally add CloudFront for global CDN

### 5. Firebase Hosting (Simple Static)
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Run `firebase init hosting`
3. Set public directory to `public`
4. Run `firebase deploy`

## 📁 What to Deploy

Only deploy the contents of the `public` folder:
- `index.html`
- `script.js`
- `styles.css`

**Do NOT deploy:**
- `node_modules/`
- `package.json` (unless hosting requires it)
- `package-lock.json`
- Any development files

## 🔧 Build Process

This application requires no build process! It's pure HTML, CSS, and JavaScript that runs directly in the browser.

## 🌍 Environment Considerations

- **No environment variables needed**
- **No backend services required**
- **No database connections**
- **Works entirely offline after initial load**

## 📱 Features After Deployment

- ✅ Investment calculations
- ✅ Ticker symbol management (saved to browser localStorage)
- ✅ Multiple investment entries
- ✅ Profit/loss calculations
- ✅ Responsive design for mobile/desktop
- ✅ Fast loading (no external dependencies)

## 🚨 Important Notes

1. **Data Storage**: Ticker symbols are saved in browser localStorage (per-user, per-browser)
2. **No User Accounts**: This is a calculator tool, not a user management system
3. **No Data Backup**: Users should export/save their calculations manually if needed
4. **Browser Compatibility**: Works in all modern browsers (Chrome, Firefox, Safari, Edge)

## 💡 Custom Domain

Most hosting services allow custom domains:
- Netlify: Add custom domain in dashboard
- Vercel: Configure domains in project settings
- GitHub Pages: Set up custom domain in repository settings

## 🔗 Example Deployment Commands

```bash
# For Netlify CLI
netlify deploy --prod --dir public

# For Vercel CLI
vercel --prod

# For AWS CLI (S3)
aws s3 sync public/ s3://your-bucket-name --delete

# Simple HTTP server for testing
npx serve public
```

## 📊 Performance

- **Load time**: < 1 second (3 small files)
- **Size**: < 50KB total
- **Hosting cost**: Free on most platforms
- **CDN**: Recommended for global users

Your calculator app is now ready to deploy anywhere! 🎉
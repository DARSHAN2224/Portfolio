# 🚀 Vercel Deployment Guide

## Overview

This guide will help you deploy your portfolio to Vercel and resolve the 404 API errors you were experiencing.

## ✅ What We Fixed

1. **Created `vercel.json`** - Proper configuration for Vercel serverless functions
2. **Updated path resolution** - Fixed `__dirname` issues in Vercel's serverless environment
3. **Added test endpoint** - Created `/api/test` to help debug deployment issues

## 🚀 Deployment Steps

### 1. **Install Vercel CLI** (if not already installed)
```bash
npm install -g vercel
```

### 2. **Login to Vercel**
```bash
vercel login
```

### 3. **Deploy to Vercel**
```bash
vercel
```

### 4. **Follow the prompts:**
- Set up and deploy: **Y**
- Which scope: **Select your account**
- Link to existing project: **N**
- Project name: **darshan-portfolio** (or your preferred name)
- In which directory: **./** (current directory)
- Override settings: **N**

## 🔧 Configuration Files

### `vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/[...all].js",
      "use": "@vercel/node"
    },
    {
      "src": "api/test.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/test",
      "dest": "/api/test.js"
    },
    {
      "src": "/api/(.*)",
      "dest": "/api/[...all].js"
    }
  ],
  "functions": {
    "api/[...all].js": {
      "maxDuration": 30
    },
    "api/test.js": {
      "maxDuration": 10
    }
  }
}
```

## 🧪 Testing Your Deployment

### 1. **Test the API endpoints:**
- **Test endpoint**: `https://your-domain.vercel.app/api/test`
- **Projects**: `https://your-domain.vercel.app/api/projects`
- **Skills**: `https://your-domain.vercel.app/api/skills`
- **Experiences**: `https://your-domain.vercel.app/api/experiences`
- **Achievements**: `https://your-domain.vercel.app/api/achievements`

### 2. **Expected responses:**
- **Test endpoint**: Should return success message with Vercel environment info
- **Data endpoints**: Should return your portfolio data or empty arrays/objects

## 🔍 Troubleshooting

### **Still getting 404 errors?**

1. **Check Vercel deployment logs:**
   ```bash
   vercel logs your-domain.vercel.app
   ```

2. **Verify function deployment:**
   - Go to Vercel dashboard
   - Check Functions tab
   - Ensure `api/[...all].js` is deployed

3. **Test locally first:**
   ```bash
   npm run dev:all
   ```
   - Test `http://localhost:3001/api/test`
   - Test `http://localhost:3001/api/projects`

### **Common Issues**

1. **Build failures**: Check if all dependencies are in `package.json`
2. **Function timeouts**: Increase `maxDuration` in `vercel.json`
3. **Path issues**: Ensure all file paths use `getProjectRoot()` function

## 📁 File Structure for Vercel

```
your-project/
├── api/
│   ├── [...all].js          # Main API handler
│   ├── test.js              # Test endpoint
│   └── index.js             # Entry point
├── server/
│   └── index.js             # Express app
├── data/                     # JSON data files
├── public/                   # Static assets
├── src/                      # React components
├── vercel.json              # Vercel configuration
└── package.json
```

## 🔄 Updating Your Deployment

### **Automatic deployments:**
- Push to your main branch
- Vercel will automatically redeploy

### **Manual deployment:**
```bash
vercel --prod
```

## 📊 Monitoring

### **Vercel Dashboard:**
- Function execution logs
- Performance metrics
- Error tracking
- Real-time deployments

### **Function Logs:**
```bash
vercel logs --follow
```

## 🎯 Next Steps

1. **Deploy to Vercel** using the steps above
2. **Test all API endpoints** to ensure they work
3. **Update your frontend** to use the new Vercel URLs
4. **Monitor performance** in Vercel dashboard

## 🆘 Need Help?

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Check deployment logs**: `vercel logs`

---

**🎉 Your portfolio should now work perfectly on Vercel with all API endpoints functioning correctly!**

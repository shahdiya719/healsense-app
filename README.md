# HealSense PWA - Deployment Guide

Your Progressive Web App is ready! This package contains everything needed to deploy the HealSense wound care monitoring app.

## Files Included

1. **index.html** - Main app interface with all features:
   - Infection detection alerts
   - Real-time sensor readings (heart rate, temperature)
   - Wound healing progress tracker (68% epithelialization)
   - Light therapy status indicator
   - Care reminders and schedule
   - Patient history
   - Contact clinician button

2. **manifest.json** - PWA configuration that enables:
   - App installation via "Add to Home Screen"
   - Custom app icon and colors
   - Standalone display (looks like native app)
   - App shortcuts for quick access to sensors and reminders

3. **service-worker.js** - Offline functionality:
   - Caches app assets for offline access
   - Network-first strategy for API calls (real-time sensor data)
   - Cache-first strategy for static assets
   - Background sync for data when connection restored
   - Periodic updates for sensor readings

## Deployment Options

### Option 1: GitHub Pages (Free, Easiest)
1. Create a GitHub repository called `healsense-app`
2. Upload all three files to the root directory
3. Go to Settings → Pages → Select "main" branch as source
4. Your app will be live at: `https://yourusername.github.io/healsense-app/`

### Option 2: Vercel (Free, Recommended for PWA)
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in your project directory
3. Follow the prompts
4. Your app will be live at a Vercel URL instantly

### Option 3: Netlify (Free)
1. Drag and drop your three files into Netlify.com
2. Your app will be live immediately with a public URL

### Option 4: Your Own Server
1. Copy all three files to your web server's public directory
2. Ensure they're served over HTTPS (required for PWA)
3. Files should be accessible at:
   - `https://yourdomain.com/index.html`
   - `https://yourdomain.com/manifest.json`
   - `https://yourdomain.com/service-worker.js`

## Generating a QR Code for Installation

Once your PWA is deployed, generate a QR code using any of these tools:

### Free Online Tools:
- **qr-code-generator.com** - Paste your URL, download as PNG
- **goqr.me** - Simple and fast
- **qr.io** - Beautiful customizable QR codes
- **the-qrcode-generator.com** - Batch generation support

### Command Line:
```bash
# Using qrencode (Linux/Mac)
qrencode -o healsense-qr.png "https://yourdomain.com/healsense-app/"

# Using Python
python3 -m pip install qrcode[pil]
python3 -c "import qrcode; qr = qrcode.QRCode(); qr.add_data('https://yourdomain.com/healsense-app/'); qr.make(); qr.make_image().save('healsense-qr.png')"
```

## User Installation Flow

When users scan the QR code:

### Android:
1. Browser opens the PWA URL
2. "Install" button appears in address bar OR in menu (⋮)
3. Tap "Install" → "HealSense - Wound Care Monitoring"
4. App installs to home screen like native app

### iOS 13.4+:
1. Browser opens the PWA URL
2. Tap Share button
3. Select "Add to Home Screen"
4. Tap "Add"
5. App appears on home screen

## Testing Locally

Before deploying, test locally:

```bash
# Start a simple HTTP server
python3 -m http.server 8000

# Visit http://localhost:8000 in your browser
# On desktop: Check DevTools → Application → Manifest to verify
# On mobile: Test the install prompt
```

## Features to Note

✓ **Offline Access** - App works without internet connection
✓ **Installable** - Behaves like a native app
✓ **Responsive** - Works on phones, tablets, desktops
✓ **Fast** - Service Worker caches assets for instant loading
✓ **Secure** - Ready for HTTPS deployment
✓ **Data Sync** - Background sync queues when offline, syncs when online

## Next Steps for Production

1. **Connect Bluetooth** - Implement real Bluetooth LE communication with ESP32 patch
2. **API Backend** - Create REST API endpoints:
   - `/api/sensor-data` - Get latest sensor readings
   - `/api/sync-data` - Upload patient data
   - `/api/alerts` - Get infection alerts
3. **Authentication** - Add user login/registration
4. **Database** - Store patient data securely (HIPAA compliant)
5. **Encryption** - Implement AES-256 for data transmission
6. **Testing** - Test on real Android and iOS devices

## HTTPS Requirements

PWA features (Service Workers, app installation) require HTTPS. All deployment options above provide HTTPS automatically.

## Support & Issues

- **App not installing?** Make sure:
  - URL is over HTTPS
  - manifest.json is accessible
  - service-worker.js is accessible
  - Browser supports PWA (Chrome, Edge, Firefox, Safari 13.4+)

- **Service Worker not updating?** 
  - Clear browser cache and reinstall app
  - Open DevTools → Application → Service Workers → Unregister

---

**Ready to launch?** Choose a deployment option above and share your QR code with your team! 🚀

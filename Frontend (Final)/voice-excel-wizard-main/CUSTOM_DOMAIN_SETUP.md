# Custom Domain Setup for HEY-XL

## Step 1: Purchase Domain
1. Go to a domain registrar (Namecheap, GoDaddy, etc.)
2. Search for your desired domain (e.g., `hey-xl.com`)
3. Purchase the domain
4. Note down the domain management credentials

## Step 2: Firebase Hosting Setup

### 2.1 Build Your Application
```bash
cd "Frontend (better cleaner version) - 2nd (wizard ai)/voice-excel-wizard-main"
npm run build
```

### 2.2 Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 2.3 Login to Firebase
```bash
firebase login
```

### 2.4 Initialize Firebase Hosting
```bash
firebase init hosting
```
- Select your project: `hey-xl7`
- Public directory: `dist`
- Configure as single-page app: `Yes`
- Set up automatic builds: `No`

### 2.5 Deploy to Firebase Hosting
```bash
firebase deploy --only hosting
```

## Step 3: Add Custom Domain in Firebase Console

### 3.1 Go to Firebase Console
1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `hey-xl7`
3. Go to **Hosting** in the left sidebar

### 3.2 Add Custom Domain
1. Click **"Add custom domain"**
2. Enter your domain (e.g., `hey-xl.com`)
3. Click **"Continue"**

### 3.3 Verify Domain Ownership
Firebase will provide you with DNS records to add:
- **A records** pointing to Firebase IPs
- **TXT record** for domain verification

## Step 4: Configure DNS Records

### 4.1 Access Your Domain's DNS Settings
1. Log into your domain registrar's control panel
2. Find **DNS Management** or **Domain Settings**
3. Look for **DNS Records** or **Zone Editor**

### 4.2 Add Firebase DNS Records
Add these records (Firebase will provide the exact values):

**A Records:**
```
Type: A
Name: @
Value: [Firebase IP 1]
TTL: 3600

Type: A  
Name: @
Value: [Firebase IP 2]
TTL: 3600
```

**TXT Record:**
```
Type: TXT
Name: @
Value: [Firebase verification string]
TTL: 3600
```

### 4.3 Wait for Propagation
- DNS changes can take 24-48 hours to propagate
- Use tools like `nslookup` or online DNS checkers to verify

## Step 5: Update OAuth Configuration

### 5.1 Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project: `hey-xl7`
3. Go to **APIs & Services** → **Credentials**
4. Find your OAuth 2.0 Client ID
5. Add authorized redirect URIs:
   - `https://hey-xl.com/__/auth/handler`
   - `https://www.hey-xl.com/__/auth/handler`

### 5.2 Firebase Console
1. Go to **Authentication** → **Settings**
2. Add authorized domains:
   - `hey-xl.com`
   - `www.hey-xl.com`

### 5.3 Update GitHub OAuth App
1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Update your OAuth app:
   - **Authorization callback URL**: `https://hey-xl.com/__/auth/handler`
   - **Homepage URL**: `https://hey-xl.com`

## Step 6: Update Application Configuration

### 6.1 Update Firebase Config (if needed)
The Firebase config should automatically work with custom domains, but verify:
```typescript
// In firebase.ts - should remain the same
const firebaseConfig = {
  apiKey: "AIzaSyChLiH0BDYsA5g75ldKlWFSfVdLU74XG08",
  authDomain: "hey-xl7.firebaseapp.com", // This can stay the same
  projectId: "hey-xl7",
  // ... rest of config
};
```

### 6.2 Update Package.json (if needed)
```json
{
  "scripts": {
    "build": "vite build",
    "deploy": "npm run build && firebase deploy --only hosting"
  }
}
```

## Step 7: Test Everything

### 7.1 Test Domain Access
1. Visit `https://hey-xl.com`
2. Verify your app loads correctly
3. Test all functionality

### 7.2 Test OAuth
1. Try Google OAuth - should show your custom domain
2. Try GitHub OAuth - should work with custom domain
3. Test email/password authentication

### 7.3 Test HTTPS
- Firebase automatically provides SSL certificates
- Verify `https://` works (not just `http://`)

## Troubleshooting

### Common Issues:
1. **DNS not propagating**: Wait 24-48 hours
2. **SSL certificate issues**: Firebase handles this automatically
3. **OAuth redirect errors**: Check authorized domains in Firebase Console
4. **Build errors**: Ensure all dependencies are installed

### Verification Commands:
```bash
# Check DNS propagation
nslookup hey-xl.com

# Check if site is accessible
curl -I https://hey-xl.com

# Test Firebase deployment
firebase deploy --only hosting
```

## Cost Breakdown:
- **Domain**: $8-15/year
- **Firebase Hosting**: Free (Spark plan)
- **SSL Certificate**: Free (Firebase provides)
- **Total**: ~$10-15/year

## Benefits:
✅ **Professional URL**: `hey-xl.com` instead of `hey-xl7.firebaseapp.com`
✅ **Custom OAuth text**: "To continue to hey-xl.com"
✅ **Better branding**: Professional appearance
✅ **SEO benefits**: Custom domain is better for search engines
✅ **SSL included**: Automatic HTTPS with Firebase

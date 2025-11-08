# GitHub OAuth Setup Instructions

## Firebase Console Configuration

### 1. Enable GitHub Provider in Firebase
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `hey-xl7`
3. Navigate to **Authentication** → **Sign-in method**
4. Find **GitHub** in the providers list
5. Click **Enable**
6. Enter the following credentials:
   - **Client ID**: `Ov23liARfl0DIfMa7Fhy`
   - **Client Secret**: `af7e28ff30cbda0404def9a6bae4e2673897daed`
7. Click **Save**

### 2. GitHub App Configuration
Make sure your GitHub OAuth App has the following settings:

**Authorization callback URL:**
```
https://hey-xl7.firebaseapp.com/__/auth/handler
```

**Homepage URL:**
```
https://hey-xl7.firebaseapp.com
```

### 3. Authorized Domains
In Firebase Console → Authentication → Settings → Authorized domains:
- Add `localhost` (for development)
- Add your production domain when you deploy

## Features Implemented

✅ **GitHub OAuth Integration**
- Full GitHub authentication with popup
- College domain validation (`@sathyabama.ac.in`)
- Automatic user creation in Firestore
- Error handling for popup blocks/cancellations

✅ **User Experience**
- Loading states with spinners
- Clear error messages
- Domain validation feedback
- Automatic account creation

✅ **Security**
- Domain restriction to college emails only
- Proper error handling
- Secure token management

## Testing

1. **Enable GitHub in Firebase Console** (follow steps above)
2. **Click GitHub button** in the auth form
3. **GitHub popup opens** asking for permissions
4. **Sign in with college email** (`@sathyabama.ac.in`)
5. **Should create user** and redirect to success section

## Troubleshooting

**If GitHub sign-in doesn't work:**
1. Check Firebase Console has GitHub enabled
2. Verify callback URL is correct
3. Check browser console for errors
4. Ensure college email domain is used

**Common Issues:**
- **Popup blocked**: Allow popups for localhost
- **Wrong domain**: Use `@sathyabama.ac.in` email
- **Firebase not configured**: Enable GitHub in Firebase Console

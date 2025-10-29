# Quick Test Guide - User Onboarding Flow

## 🚀 Quick Start (5 Minutes)

### 1. Setup Database (One-time)

```bash
cd server
npx prisma migrate dev --name add_user_fields
```

### 2. Start Backend

```bash
cd server
npm run dev
```

✅ Server should start on http://localhost:3000

### 3. Start Client (New Terminal)

```bash
cd client
npm run android
# OR
npm run ios
```

## 🧪 Test Flow

### Test 1: New User Signup ✨

1. **Open App**
   - Should see onboarding (4 screens)
2. **Complete Onboarding**
   - Swipe through screens
   - Tap "Get Started" on last screen
3. **Connect Wallet**
   - See beautiful connect wallet prompt
   - Tap "Connect Wallet"
   - Select wallet (Phantom/Solflare)
   - Approve connection
4. **Sign Authentication Message**
   - Wallet will prompt to sign message
   - Approve signature
   - App checks if user exists
5. **Fill Signup Form**
   - Should see signup screen
   - Fill in:
     - Name: "John Doe"
     - Email: "john@test.com"
     - Doom Limit: "60"
   - Tap "Create Account"
6. **Sign Again**
   - Wallet prompts for another signature (for signup)
   - Approve
7. **Success! 🎉**
   - Should see main app
   - Home screen shows "Hi John" (first name)
   - Wallet address visible in top right

### Test 2: Existing User Login ✅

1. **Clear App & Relaunch**
   - Close and reopen app
2. **Skip Onboarding**
   - Should skip (already completed)
3. **Connect Same Wallet**
   - Tap "Connect Wallet"
   - Select same wallet as before
4. **Sign Message**
   - Approve signature
5. **Direct to Main App**
   - Should skip signup
   - Go straight to main app
   - Shows "Hi John" immediately

### Test 3: Wallet Disconnect 🔌

1. **From Main App**
   - Tap wallet address (top right)
   - Menu appears
2. **Tap Disconnect**
   - User logged out
   - Returns to connect wallet prompt
3. **Can Reconnect**
   - Tap "Connect Wallet" again
   - Flow works as existing user

## ✅ What to Verify

### Visual Checks:

- [ ] Onboarding screens look good
- [ ] Connect wallet prompt is centered and beautiful
- [ ] Signup form has all fields
- [ ] Wallet button shows address when connected
- [ ] Wallet menu opens on tap
- [ ] Home screen shows user's first name

### Functional Checks:

- [ ] Onboarding completes successfully
- [ ] Wallet connects without errors
- [ ] Signature prompts appear
- [ ] New user sees signup form
- [ ] Existing user skips signup
- [ ] Account creates successfully
- [ ] User name appears in welcome message
- [ ] Wallet menu works (copy, disconnect)
- [ ] Disconnect returns to connect prompt

### Backend Checks:

```bash
# Check if user was created
cd server
npx prisma studio
# Open http://localhost:5555
# Navigate to User table
# Verify your user exists
```

## 🐛 Common Issues & Fixes

### Issue: "Module not found: Buffer"

**Fix:**

```bash
cd client
npm install buffer
```

### Issue: "Cannot find module '@solana-mobile/mobile-wallet-adapter-protocol-web3js'"

**Fix:**

```bash
cd client
npm install @solana-mobile/mobile-wallet-adapter-protocol-web3js
```

### Issue: Database connection error

**Fix:**

```bash
cd server
# Make sure PostgreSQL is running
# Update DATABASE_URL in .env
npx prisma migrate dev
```

### Issue: Signature verification fails

**Fix:**

- Check server logs for details
- Verify wallet is actually signing
- Check timestamp isn't too old

### Issue: "User already exists"

**Solution:**

- This wallet already signed up!
- Either:
  - Connect with different wallet (new user)
  - Continue as existing user

## 📊 Expected Behavior

### New User Flow:

```
Onboarding → Connect Wallet → Sign → Signup Form → Sign Again → Main App
Total time: ~2 minutes
```

### Existing User Flow:

```
Connect Wallet → Sign → Main App
Total time: ~30 seconds
```

## 🎯 Success Criteria

✅ Flow is complete when:

1. New users can sign up with wallet
2. Existing users can login with wallet
3. User's name shows in welcome message
4. Wallet menu works (disconnect)
5. No console errors
6. User data saved in database

## 📝 Test Checklist

- [ ] Run `npx prisma migrate dev`
- [ ] Start server (`npm run dev`)
- [ ] Start client (`npm run android/ios`)
- [ ] Test new user signup
- [ ] Verify user in database (Prisma Studio)
- [ ] Test existing user login
- [ ] Test wallet disconnect
- [ ] Check console for errors
- [ ] Verify signatures work
- [ ] Confirm API calls succeed

## 🚀 Ready for Demo!

Once all tests pass:

1. User authentication ✅
2. Signup flow ✅
3. Personalization ✅
4. Wallet integration ✅

**Next:** Connect challenges to users and track screen time!

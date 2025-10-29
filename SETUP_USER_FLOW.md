# User Onboarding & Signup Flow - Setup Guide

## 🎉 What Was Implemented

Complete user authentication and signup flow with:

- ✅ Wallet-based authentication using signature verification
- ✅ User check (new vs existing)
- ✅ Signup form for new users
- ✅ User context available throughout app
- ✅ Personalized welcome messages

## 📋 Setup Steps

### 1. Update Database Schema

```bash
cd server
npx prisma migrate dev --name add_user_fields
```

This will:

- Add `createdAt` and `updatedAt` timestamps to User model
- Change `doomscrollLimit` from String to Int
- Generate new Prisma client

### 2. Start Backend Server

```bash
cd server
npm run dev
```

Server will be running on `http://localhost:3000`

### 3. Start Client App

```bash
cd client
npm start
# Then press 'a' for Android or 'i' for iOS
```

## 🔄 User Flow

### For New Users:

1. **Onboarding** → User sees 4-screen introduction
2. **Complete Onboarding** → Taps "Get Started"
3. **Connect Wallet** → Beautiful connect wallet prompt appears
4. **Sign Message** → Wallet adapter opens, user signs auth message
5. **User Check** → App checks if wallet exists in database
6. **Signup Form** → New users see signup screen with:
   - Name input
   - Email input
   - Doom scroll limit (minutes/day)
7. **Create Account** → Sign message again, account created
8. **Main App** → User sees personalized "Hi [Name]" 🎉

### For Existing Users:

1. **Onboarding** → Skipped if already completed
2. **Connect Wallet** → Prompt appears
3. **Sign Message** → User signs auth message
4. **User Check** → App detects existing user
5. **Load Data** → User data fetched from backend
6. **Main App** → Immediately shows "Hi [Name]" ✅

## 🔐 How Authentication Works

### Client Side:

```typescript
1. User connects wallet
2. App generates message: "Sign this message to authenticate..."
3. User signs message using mobile wallet adapter
4. Signature sent with all API requests in headers
```

### Server Side:

```typescript
1. Receives wallet, signature, message, timestamp in headers
2. Validates timestamp (5 minute window)
3. Verifies signature using tweetnacl
4. Attaches wallet address to request
5. Proceeds with API logic
```

## 📡 API Endpoints

### POST /api/user/check

**Request:**

```json
Headers:
  wallet: "AbC123..."
  signature: "base64_signature"
  message: "Sign this message..."
  timestamp: "1234567890"

Body:
  { "wallet": "AbC123..." }
```

**Response:**

```json
{
  "exists": true,
  "user": {
    "id": "uuid",
    "wallet": "AbC123...",
    "name": "John Doe",
    "email": "john@example.com",
    "doomscrollLimit": 60,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### POST /api/user/signup

**Request:**

```json
Headers: (same as above)

Body:
{
  "wallet": "AbC123...",
  "name": "John Doe",
  "email": "john@example.com",
  "doomscrollLimit": 60
}
```

**Response:**

```json
{
  "success": true,
  "user": { ...user object }
}
```

### GET /api/user/:wallet

**Request:**

```json
Headers: (same as above)
```

**Response:**

```json
{
  "user": { ...user object }
}
```

## 🧪 Testing the Flow

### Test as New User:

1. Clear app data: `npx react-native start --reset-cache`
2. Launch app
3. Complete onboarding
4. Connect wallet (use a new test wallet)
5. Fill signup form
6. Verify "Hi [YourName]" appears

### Test as Existing User:

1. Use wallet that already signed up
2. Connect wallet
3. App should skip signup and show main app immediately

### Test Wallet Disconnect:

1. Open wallet menu (tap wallet address)
2. Tap "Disconnect"
3. Should return to connect wallet prompt

## 🎯 Key Features

### UserContext Provides:

- `user` - Current user object or null
- `isLoading` - Loading state
- `isCheckingUser` - Checking if user exists
- `needsSignup` - True if new user needs to sign up
- `error` - Error message if any
- `checkUserStatus()` - Re-check user
- `setUser(user)` - Set user after signup
- `refreshUser()` - Refresh user data
- `clearUser()` - Clear user data

### Usage in Components:

```typescript
import { useUser } from "../contexts/UserContext";

function MyComponent() {
  const { user, isLoading } = useUser();

  if (isLoading) return <Loading />;
  if (!user) return <NotSignedIn />;

  return <div>Hello {user.name}!</div>;
}
```

## 🐛 Troubleshooting

### "Missing authentication headers"

- Make sure wallet is connected
- Check that signMessage is working
- Verify headers are being sent

### "Timestamp expired"

- Clock sync issue - check device time
- Signature took too long - try again

### "User already exists"

- Wallet already signed up
- Try connecting with existing wallet

### "Email already in use"

- Email taken by another wallet
- Use different email

### Database connection failed

- Make sure PostgreSQL is running
- Check DATABASE_URL in .env
- Run `npx prisma migrate dev`

## 📝 Notes

- Signatures are valid for 5 minutes
- User data auto-refreshes when wallet changes
- Welcome screen shows first name only
- All API calls require authentication
- Signup is one-time per wallet
- Email must be unique across all users

## 🚀 Next Steps

1. ✅ User flow complete
2. 🔄 Next: Connect challenges to user
3. 🔄 Next: Show user's challenges
4. 🔄 Next: Track screen time per user
5. 🔄 Next: Show user stats from database

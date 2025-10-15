# Admin Implementation Summary

## ✅ What Was Implemented

Admin-only challenge creation functionality has been added to the server. Only authorized admins can create challenges on-chain.

## 📁 Files Created/Modified

### New Files Created

1. **`src/middleware/admin.middleware.ts`**

   - Middleware to verify admin access
   - Checks `x-admin-key` header against `ADMIN_SECRET_KEY` env var

2. **`src/routes/admin.routes.ts`**

   - Admin-specific API endpoints
   - POST `/admin/challenges/create` - Create new challenge
   - GET `/admin/challenges/count` - Get challenge count
   - GET `/admin/health` - Admin health check

3. **`scripts/create-test-challenge.js`**

   - Helper script to quickly create test challenges
   - Usage: `node scripts/create-test-challenge.js`

4. **`ADMIN_GUIDE.md`**
   - Complete documentation on using admin endpoints
   - Examples, error handling, and best practices

### Files Modified

1. **`src/config/env.ts`**

   - Added `ADMIN_SECRET_KEY` to environment schema
   - Required for admin authentication

2. **`src/services/solana.service.ts`**

   - Added `createChallenge()` function
   - Calls smart contract's `create_challenge` instruction
   - Returns challenge ID, PDA, and transaction signature

3. **`src/index.ts`**
   - Mounted admin routes at `/admin`
   - Updated endpoint logging

## 🔧 Setup Required

### 1. Add to .env file

```bash
ADMIN_SECRET_KEY=your_super_secret_admin_key_here
```

**Generate a secure key:**

```bash
openssl rand -base64 32
```

### 2. Restart the server

```bash
npm run dev
```

## 🚀 How to Use

### Option 1: Using cURL

```bash
# Calculate timestamps
START_TIME=$(date -v+1H +%s)
END_TIME=$(date -v+25H +%s)

# Create challenge
curl -X POST http://localhost:3000/admin/challenges/create \
  -H "x-admin-key: your_admin_key" \
  -H "Content-Type: application/json" \
  -d "{
    \"entry_fee\": 1000000,
    \"doom_threshold\": 60,
    \"start_time\": $START_TIME,
    \"end_time\": $END_TIME
  }"
```

### Option 2: Using the Test Script

```bash
# Set your admin key
export ADMIN_SECRET_KEY=your_admin_key

# Run the script
node scripts/create-test-challenge.js
```

### Option 3: Using Postman

1. Create a new POST request to `http://localhost:3000/admin/challenges/create`
2. Add header: `x-admin-key: your_admin_key`
3. Add header: `Content-Type: application/json`
4. Body (raw JSON):

```json
{
  "entry_fee": 1000000,
  "doom_threshold": 60,
  "start_time": 1729123200,
  "end_time": 1729209600
}
```

## 📋 Available Admin Endpoints

| Method | Endpoint                   | Description                   |
| ------ | -------------------------- | ----------------------------- |
| GET    | `/admin/health`            | Verify admin access           |
| GET    | `/admin/challenges/count`  | Get total challenges created  |
| POST   | `/admin/challenges/create` | Create new challenge on-chain |

All endpoints require `x-admin-key` header.

## 🔒 Security Features

1. **Secret Key Authentication**: Only requests with valid `x-admin-key` are accepted
2. **Input Validation**: All parameters are validated using Zod schemas
3. **Time Validation**: Start time must be in future, end time must be after start
4. **Rate Limiting**: Admin endpoints are protected by rate limiters
5. **Error Handling**: Detailed error messages for debugging

## 🎯 Challenge Creation Flow

```
1. Admin sends POST /admin/challenges/create
   ↓
2. Server validates admin key
   ↓
3. Server validates request parameters
   ↓
4. Server calls smart contract (create_challenge)
   ↓
5. Transaction is submitted to blockchain
   ↓
6. Server waits for confirmation
   ↓
7. Server syncs challenge to database
   ↓
8. Server returns challenge details to admin
   ↓
9. Challenge is now visible in mobile app
   ↓
10. Users can join via mobile app
```

## 🎨 Example Challenges

### Daily Detox (Strict)

- Entry Fee: 0.01 SOL (10,000,000 lamports)
- Doom Threshold: 30 minutes
- Duration: 24 hours

### Weekend Challenge (Moderate)

- Entry Fee: 0.1 SOL (100,000,000 lamports)
- Doom Threshold: 120 minutes
- Duration: 48 hours

### Weekly Goal (Relaxed)

- Entry Fee: 0.5 SOL (500,000,000 lamports)
- Doom Threshold: 300 minutes
- Duration: 7 days

## 📝 Next Steps

### For Testing

1. Add `ADMIN_SECRET_KEY` to your `.env`
2. Restart server: `npm run dev`
3. Create a test challenge: `node scripts/create-test-challenge.js`
4. Check database to verify sync worked
5. Try joining from mobile app

### For Production

1. Generate a strong admin key: `openssl rand -base64 32`
2. Store it securely (use a secrets manager)
3. Use HTTPS for all admin requests
4. Monitor admin endpoint usage
5. Rotate keys regularly

### Future Enhancements

- [ ] Web-based admin panel
- [ ] Challenge templates (preset configurations)
- [ ] Recurring challenges (daily, weekly)
- [ ] Bulk challenge creation
- [ ] Challenge analytics dashboard
- [ ] Multi-admin support with roles

## ❓ Troubleshooting

### "Unauthorized: Admin key required"

- Make sure you're sending `x-admin-key` header
- Check header spelling (lowercase)

### "Forbidden: Invalid admin key"

- Verify `ADMIN_SECRET_KEY` in `.env` matches your header
- Restart server after changing `.env`

### "Start time must be in the future"

- Calculate timestamp: `Math.floor(Date.now() / 1000) + 3600`
- Make sure your system time is correct

### "Error creating challenge"

- Check you have SOL in verifier wallet
- Verify Solana RPC is accessible
- Check program is deployed correctly

For more details, see `ADMIN_GUIDE.md`.

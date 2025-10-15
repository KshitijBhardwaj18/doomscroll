# Quick Start - Admin Challenge Creation

## Step 1: Add Admin Key to .env

Open `/Users/kshitij/development/doomscroll/server/.env` and add:

```bash
ADMIN_SECRET_KEY=my_super_secret_admin_key_12345
```

**For production, generate a secure key:**

```bash
openssl rand -base64 32
```

## Step 2: Restart Your Server

```bash
cd /Users/kshitij/development/doomscroll/server
npm run dev
```

You should see the admin endpoints listed:

```
Admin (requires x-admin-key header):
   POST /admin/challenges/create
   GET  /admin/challenges/count
   GET  /admin/health
```

## Step 3: Create Your First Challenge

### Using the Test Script (Easiest)

```bash
cd /Users/kshitij/development/doomscroll/server
ADMIN_SECRET_KEY=my_super_secret_admin_key_12345 node scripts/create-test-challenge.js
```

This creates a challenge that:

- Starts in 1 hour
- Lasts 24 hours
- Entry fee: 0.001 SOL
- Doom threshold: 60 minutes

### Using cURL

```bash
# Calculate timestamps
START_TIME=$(date -v+1H +%s)
END_TIME=$(date -v+25H +%s)

# Create challenge
curl -X POST http://localhost:3000/admin/challenges/create \
  -H "x-admin-key: my_super_secret_admin_key_12345" \
  -H "Content-Type: application/json" \
  -d "{
    \"entry_fee\": 1000000,
    \"doom_threshold\": 60,
    \"start_time\": $START_TIME,
    \"end_time\": $END_TIME
  }"
```

## Step 4: Verify Challenge Was Created

Check the response:

```json
{
  "success": true,
  "challenge_id": 0,
  "challenge_pda": "Abc123...",
  "transaction": "5xYz...",
  "explorer": "https://explorer.solana.com/tx/5xYz...?cluster=devnet"
}
```

Check your database:

```bash
# If using Prisma Studio
npx prisma studio
```

Check the blockchain:

- Click the `explorer` link in the response

## Step 5: Test From Mobile App

Now users can:

1. Open the mobile app
2. See the challenge in the list
3. Join the challenge (pays entry fee)
4. Start tracking screen time

## Common Commands

### Create Challenge with Custom Parameters

```bash
curl -X POST http://localhost:3000/admin/challenges/create \
  -H "x-admin-key: my_super_secret_admin_key_12345" \
  -H "Content-Type: application/json" \
  -d '{
    "entry_fee": 10000000,
    "doom_threshold": 120,
    "start_time": 1729123200,
    "end_time": 1729209600
  }'
```

### Check How Many Challenges Exist

```bash
curl -H "x-admin-key: my_super_secret_admin_key_12345" \
  http://localhost:3000/admin/challenges/count
```

### Verify Admin Access

```bash
curl -H "x-admin-key: my_super_secret_admin_key_12345" \
  http://localhost:3000/admin/health
```

## Parameter Reference

### entry_fee

- In lamports (1 SOL = 1,000,000,000 lamports)
- Examples:
  - 1,000,000 = 0.001 SOL
  - 10,000,000 = 0.01 SOL
  - 100,000,000 = 0.1 SOL

### doom_threshold

- Maximum allowed social media minutes
- Examples:
  - 30 = Very strict (half hour)
  - 60 = Strict (1 hour)
  - 120 = Moderate (2 hours)
  - 180 = Relaxed (3 hours)

### start_time / end_time

- Unix timestamps (seconds since 1970)
- Calculate in JavaScript:
  ```javascript
  Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
  ```
- Calculate in bash:
  ```bash
  date -v+1H +%s  # macOS
  date -d '+1 hour' +%s  # Linux
  ```

## Troubleshooting

**Problem:** "Invalid admin key"

- Solution: Check `ADMIN_SECRET_KEY` in `.env` matches your header

**Problem:** "Start time must be in the future"

- Solution: Use `date +%s` to get current timestamp, add to it

**Problem:** "Failed to create challenge"

- Solution: Check verifier wallet has SOL, check Solana RPC is accessible

**Problem:** Script can't find admin key

- Solution: Set environment variable: `export ADMIN_SECRET_KEY=your_key`

## What's Next?

1. **Mobile App Integration**: Users browse and join challenges
2. **Screen Time Tracking**: Users submit reports via app
3. **Automatic Rewards**: Server distributes at end of challenge
4. **Admin Panel** (Future): Web UI for creating challenges

## Need More Info?

- See `ADMIN_GUIDE.md` for detailed documentation
- See `ADMIN_IMPLEMENTATION.md` for technical details
- See `README.md` for full server documentation

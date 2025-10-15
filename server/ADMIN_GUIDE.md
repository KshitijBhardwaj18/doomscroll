# Admin Guide - Challenge Creation

This guide explains how to use the admin API endpoints to create and manage challenges.

## Setup

### 1. Add Admin Secret Key to .env

Add this to your `.env` file:

```bash
ADMIN_SECRET_KEY=your_super_secret_admin_key_here
```

**Important:** Use a strong, random secret key in production. Generate one using:

```bash
openssl rand -base64 32
```

### 2. Verify Admin Access

Test that your admin key works:

```bash
curl -H "x-admin-key: your_super_secret_admin_key_here" \
  http://localhost:3000/admin/health
```

Expected response:

```json
{
  "status": "ok",
  "message": "Admin access verified",
  "timestamp": "2025-10-15T..."
}
```

## Creating Challenges

### Create Challenge Endpoint

**POST** `/admin/challenges/create`

**Headers:**

- `x-admin-key`: Your admin secret key
- `Content-Type`: application/json

**Request Body:**

```json
{
  "entry_fee": 1000000,
  "doom_threshold": 60,
  "start_time": 1729123200,
  "end_time": 1729209600
}
```

**Parameters:**

- `entry_fee` (number): Entry fee in lamports (1 SOL = 1,000,000,000 lamports)
- `doom_threshold` (number): Maximum allowed social media minutes (1-65535)
- `start_time` (number): Unix timestamp when challenge starts (must be in future)
- `end_time` (number): Unix timestamp when challenge ends (must be after start_time)

### Example: Create a 24-Hour Challenge

```bash
# Calculate timestamps (example: starts in 1 hour, lasts 24 hours)
START_TIME=$(date -v+1H +%s)
END_TIME=$(date -v+25H +%s)

# Create challenge
curl -X POST http://localhost:3000/admin/challenges/create \
  -H "x-admin-key: your_super_secret_admin_key_here" \
  -H "Content-Type: application/json" \
  -d "{
    \"entry_fee\": 1000000,
    \"doom_threshold\": 60,
    \"start_time\": $START_TIME,
    \"end_time\": $END_TIME
  }"
```

**Success Response:**

```json
{
  "success": true,
  "challenge_id": 0,
  "challenge_pda": "Abc123...",
  "transaction": "5xYz...",
  "explorer": "https://explorer.solana.com/tx/5xYz...?cluster=devnet"
}
```

### Example: Weekend Detox Challenge

```bash
# Friday 6 PM to Sunday 6 PM (48 hours)
# Entry fee: 0.01 SOL
# Doom threshold: 120 minutes (2 hours)

curl -X POST http://localhost:3000/admin/challenges/create \
  -H "x-admin-key: your_admin_key" \
  -H "Content-Type: application/json" \
  -d '{
    "entry_fee": 10000000,
    "doom_threshold": 120,
    "start_time": 1729886400,
    "end_time": 1730059200
  }'
```

## Check Challenge Count

Get the current number of challenges and the next challenge ID:

```bash
curl -H "x-admin-key: your_admin_key" \
  http://localhost:3000/admin/challenges/count
```

Response:

```json
{
  "challenge_count": 5,
  "next_challenge_id": 5
}
```

## Helper Scripts

### Calculate Unix Timestamps (Node.js)

```javascript
// Now + 1 hour
const startTime = Math.floor(Date.now() / 1000) + 3600;

// Now + 25 hours (24-hour challenge)
const endTime = Math.floor(Date.now() / 1000) + 90000;

console.log("Start:", startTime, new Date(startTime * 1000));
console.log("End:", endTime, new Date(endTime * 1000));
```

### Lamports Conversion

```javascript
// SOL to Lamports
const sol = 0.01;
const lamports = sol * 1_000_000_000; // 10,000,000

// Lamports to SOL
const lamports = 10_000_000;
const sol = lamports / 1_000_000_000; // 0.01
```

## Common Entry Fees

| SOL   | Lamports      |
| ----- | ------------- |
| 0.001 | 1,000,000     |
| 0.01  | 10,000,000    |
| 0.1   | 100,000,000   |
| 1.0   | 1,000,000,000 |

## Common Doom Thresholds

| Minutes | Description             |
| ------- | ----------------------- |
| 30      | Half hour (very strict) |
| 60      | 1 hour (strict)         |
| 120     | 2 hours (moderate)      |
| 180     | 3 hours (relaxed)       |
| 300     | 5 hours (very relaxed)  |

## Challenge Flow

1. **Admin creates challenge** (this API)
2. Server confirms transaction on blockchain
3. Server syncs challenge to database
4. Challenge appears in mobile app
5. Users join via mobile app (direct blockchain interaction)
6. Users submit screen time reports to server
7. At end_time, server auto-distributes rewards

## Error Handling

### Invalid Admin Key

```json
{
  "error": "Forbidden: Invalid admin key"
}
```

### Invalid Parameters

```json
{
  "error": "Invalid request body",
  "details": [
    {
      "code": "too_small",
      "minimum": 1,
      "path": ["entry_fee"],
      "message": "Number must be greater than or equal to 1"
    }
  ]
}
```

### Start Time in Past

```json
{
  "error": "Start time must be in the future"
}
```

## Security Notes

1. **Never commit** `.env` file to git
2. **Rotate** admin key regularly in production
3. **Use HTTPS** in production
4. **Rate limit** admin endpoints (already implemented)
5. **Monitor** admin endpoint usage via logs

## Future: Web Admin Panel

In the future, you can build a simple web interface:

- Login with admin key
- Date/time pickers for start/end times
- Preset templates (daily, weekly, weekend)
- View all created challenges
- See participation stats

For now, use Postman or cURL for challenge creation.

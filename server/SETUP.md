# Doomscroll Server Setup Guide

## Quick Start

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database running
- Solana CLI installed (for generating keypair)
- Your deployed contract Program ID

### Step 1: Install Dependencies

```bash
cd server
npm install
```

### Step 2: Create Environment File

Copy the example and fill in your values:

```bash
# Create .env file
cat > .env << EOF
PORT=3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/doomscroll
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_NETWORK=devnet
PROGRAM_ID=YOUR_PROGRAM_ID_HERE
VERIFIER_KEYPAIR_PATH=./keys/verifier.json
NODE_ENV=development
EOF
```

### Step 3: Generate Verifier Keypair

```bash
mkdir -p keys
solana-keygen new --outfile keys/verifier.json --no-bip39-passphrase
```

**Important:** This wallet needs to be set as the `verifier` when creating challenges on-chain!

### Step 4: Copy Contract IDL

```bash
# From the server directory
mkdir -p src/contract-idl
cp ../contract/target/idl/contract.json src/contract-idl/contract.json
```

Then update `src/config/solana.ts` line 8:

```typescript
import idl from "./contract-idl/contract.json";
```

### Step 5: Setup Database

```bash
# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate
```

### Step 6: Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Or build and run production
npm run build
npm start
```

## Verify Setup

Once the server is running, test it:

```bash
# Health check
curl http://localhost:3000/health

# Get challenges
curl http://localhost:3000/api/challenges
```

## Testing Authentication

```bash
# Get challenge message
curl "http://localhost:3000/auth/challenge?wallet=YOUR_WALLET_ADDRESS"

# Sign the message with your wallet, then verify:
curl -X POST http://localhost:3000/auth/verify \
  -H "Content-Type: application/json" \
  -d '{
    "wallet": "YOUR_WALLET_ADDRESS",
    "signature": "SIGNED_MESSAGE_BASE64",
    "message": "MESSAGE_FROM_CHALLENGE",
    "timestamp": 1234567890
  }'
```

## Common Issues

### "Cannot find module './contract-idl/contract.json'"

Make sure you copied the IDL from your contract build:

```bash
cp ../contract/target/idl/contract.json src/contract-idl/contract.json
```

### "Database connection error"

1. Ensure PostgreSQL is running
2. Check your DATABASE_URL in .env
3. Create the database if it doesn't exist:
   ```bash
   createdb doomscroll
   ```

### "Verifier keypair not found"

Generate it with:

```bash
solana-keygen new --outfile keys/verifier.json
```

## Next Steps

1. Fund the verifier wallet with some SOL for transaction fees
2. Set the verifier wallet as the `verifier` parameter when creating challenges
3. Create your first challenge from the frontend/client
4. Test submitting screen time reports
5. Wait for the challenge to end and see rewards distributed automatically!

## Production Deployment

For production:

1. Use a production PostgreSQL database
2. Set `SOLANA_RPC_URL` to mainnet or a premium RPC
3. Set `SOLANA_NETWORK=mainnet-beta`
4. Secure your verifier keypair (use secrets management)
5. Set up proper monitoring and logging
6. Use a process manager like PM2
7. Set up SSL/HTTPS with nginx or similar

```bash
# Example with PM2
npm install -g pm2
npm run build
pm2 start dist/index.js --name doomscroll-server
pm2 save
pm2 startup
```

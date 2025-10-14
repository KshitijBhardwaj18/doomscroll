# Doomscroll Server

Backend server for the Doomscroll challenge tracking system. This server tracks user screen time, manages challenges, and distributes rewards via Solana smart contract.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/doomscroll
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_NETWORK=devnet
PROGRAM_ID=your_deployed_program_id_here
VERIFIER_KEYPAIR_PATH=./keys/verifier.json
NODE_ENV=development
```

### 3. Generate Verifier Keypair

Create a `keys` directory and generate a verifier keypair:

```bash
mkdir keys
solana-keygen new --outfile keys/verifier.json
```

This wallet will be used to call the `distribute_rewards` instruction on-chain.

### 4. Set up Database

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio to view data
npm run prisma:studio
```

### 5. Copy Contract IDL

Copy the IDL from your contract build to the server:

```bash
cp ../contract/target/idl/contract.json src/contract-idl.json
```

Update the import in `src/config/solana.ts` to point to the correct location.

## Running

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

## API Endpoints

### Authentication

- **POST /auth/verify** - Verify wallet signature
- **GET /auth/challenge** - Get challenge message to sign

### Challenges

- **GET /api/challenges** - Get all challenges
- **GET /api/challenges/:id** - Get challenge details
- **GET /api/challenges/:id/participants** - Get participants
- **GET /api/challenges/:id/leaderboard** - Get leaderboard
- **POST /api/challenges/sync/:challengeId** - Sync from blockchain

### Screen Time

- **POST /api/screen-time/report** - Submit screen time (requires auth)
- **GET /api/screen-time/user/:wallet/challenge/:challengeId** - Get user's screen time
- **GET /api/screen-time/user/:wallet/challenges** - Get user's challenges

## Background Jobs

### Challenge Sync (Every 5 minutes)

- Syncs active challenges from blockchain to database
- Updates participant lists

### Reward Distribution (Every minute)

- Finds challenges that have ended
- Determines winners based on doom threshold
- Calls `distribute_rewards` on-chain
- Updates challenge status

## Architecture

```
server/
├── src/
│   ├── config/          # Configuration (DB, Solana, env)
│   ├── services/        # Business logic
│   ├── routes/          # API endpoints
│   ├── jobs/            # Cron jobs
│   ├── middleware/      # Auth, rate limiting
│   └── index.ts         # Entry point
├── prisma/
│   └── schema.prisma    # Database schema
└── package.json
```

## Database Schema

- **Challenge** - On-chain challenge data (cached)
- **Participant** - Challenge participants (cached)
- **ScreenTimeReport** - User-submitted screen time data

## Security

- Wallet signature verification for all authenticated endpoints
- Rate limiting on all API endpoints
- Verifier keypair protection (never expose)
- Input validation with Zod

## Development

### Useful Commands

```bash
# Watch mode
npm run dev

# Build TypeScript
npm run build

# Generate Prisma client
npm run prisma:generate

# Create migration
npm run prisma:migrate

# Reset database
npx prisma migrate reset

# View database
npm run prisma:studio
```

## Troubleshooting

### "Program not initialized"

Make sure your `.env` file has the correct `PROGRAM_ID` and the contract IDL is copied to the correct location.

### "Verifier keypair not found"

Ensure `keys/verifier.json` exists and is valid. Generate it with `solana-keygen new`.

### Database connection errors

Check your `DATABASE_URL` in `.env` and ensure PostgreSQL is running.

## Next Steps

- Add admin panel for manual overrides
- Implement email/password authentication
- Add WebSocket for real-time updates
- Add analytics dashboard
- Implement automated challenge creation
- Add caching layer (Redis)

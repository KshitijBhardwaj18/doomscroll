# Doomscroll Backend Server

<div align="center">

**Express.js backend API for managing users, challenges, and rewards**

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)

</div>

---

## 📋 Overview

The Doomscroll backend is a RESTful API server built with Express.js and TypeScript. It handles user authentication, challenge management, screen time tracking, and reward distribution through integration with Solana blockchain.

## ✨ Features

### 🔐 Authentication
- **Wallet-based Auth**: Solana wallet signature verification
- **JWT Tokens**: Secure session management
- **Rate Limiting**: Protection against abuse

### 👤 User Management
- **User Registration**: Create accounts with wallet addresses
- **Profile Management**: Update doom limits and preferences
- **Screen Time Tracking**: Store and retrieve usage data

### 🏆 Challenge System
- **Challenge CRUD**: Create, read, update, and delete challenges
- **Participant Management**: Join/leave challenges
- **Leaderboard**: Real-time rankings based on usage
- **Status Tracking**: Active, upcoming, and ended challenges

### 💰 Rewards
- **Automatic Distribution**: Cron job for reward payouts
- **Winner Calculation**: Determine winners based on usage
- **Blockchain Integration**: Interact with Solana smart contracts

### 📊 Analytics
- **Usage Statistics**: Daily, weekly, and monthly reports
- **Challenge Metrics**: Participation rates and success rates
- **Admin Dashboard**: Monitor system health

## 🛠 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: Solana wallet signatures
- **Blockchain**: Solana Web3.js + Anchor
- **Scheduling**: node-cron
- **Validation**: Zod (optional)

## 🚀 Getting Started

### Prerequisites

```bash
# Node.js 18+
node --version

# PostgreSQL 15+
psql --version

# Yarn or npm
yarn --version
```

### Installation

1. **Install Dependencies**
```bash
cd server
yarn install
```

2. **Setup Database**
```bash
# Start PostgreSQL with Docker
docker-compose up -d

# Or use local PostgreSQL
# Create database manually
createdb doomscroll
```

3. **Configure Environment**
```bash
# Create .env file
cp .env.example .env

# Edit .env with your settings
nano .env
```

4. **Run Migrations**
```bash
npx prisma migrate dev
```

5. **Generate Prisma Client**
```bash
npx prisma generate
```

6. **Start Server**
```bash
# Development
yarn dev

# Production
yarn build
yarn start
```

## 📁 Project Structure

```
server/
├── src/
│   ├── routes/              # API route handlers
│   │   ├── user.routes.ts
│   │   ├── challenge.routes.ts
│   │   ├── screentime.routes.ts
│   │   └── admin.routes.ts
│   ├── middleware/          # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── rateLimit.middleware.ts
│   │   └── admin.middleware.ts
│   ├── jobs/                # Cron jobs
│   │   ├── syncChallenges.job.ts
│   │   └── distributeRewards.job.ts
│   ├── services/            # Business logic
│   │   ├── solana.service.ts
│   │   └── challenge.service.ts
│   └── index.ts            # Server entry point
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Database migrations
├── .env                    # Environment variables
├── tsconfig.json          # TypeScript configuration
└── package.json
```

## 🔧 Configuration

### Environment Variables (.env)

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/doomscroll"

# Server
PORT=3000
NODE_ENV=development

# Solana
SOLANA_RPC_URL="https://api.devnet.solana.com"
SOLANA_PROGRAM_ID="your_program_id_here"
SOLANA_WALLET_PRIVATE_KEY="your_private_key_here"

# JWT (optional)
JWT_SECRET="your_jwt_secret_here"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/check          # Check if user exists
POST   /api/auth/signup         # Create new user
GET    /api/auth/user           # Get current user
```

### Users
```
GET    /api/users/:walletAddress    # Get user by wallet
PUT    /api/users/:walletAddress    # Update user
DELETE /api/users/:walletAddress    # Delete user
```

### Challenges
```
GET    /api/challenges              # List all challenges
GET    /api/challenges/:id          # Get challenge details
POST   /api/challenges              # Create challenge (admin)
PUT    /api/challenges/:id          # Update challenge (admin)
DELETE /api/challenges/:id          # Delete challenge (admin)
POST   /api/challenges/:id/join     # Join challenge
POST   /api/challenges/:id/leave    # Leave challenge
GET    /api/challenges/:id/leaderboard  # Get leaderboard
```

### Screen Time
```
POST   /api/screentime              # Report screen time
GET    /api/screentime/:walletAddress  # Get user's screen time
GET    /api/screentime/:walletAddress/daily  # Daily stats
GET    /api/screentime/:walletAddress/weekly # Weekly stats
```

### Admin
```
GET    /api/admin/stats             # System statistics
POST   /api/admin/sync-challenges   # Sync with blockchain
POST   /api/admin/distribute-rewards # Trigger reward distribution
```

## 🗄 Database Schema

### User
```prisma
model User {
  id              String   @id @default(uuid())
  walletAddress   String   @unique
  name            String
  email           String?
  doomscrollLimit Int      @default(60)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  screenTimes     ScreenTime[]
  participants    Participant[]
}
```

### Challenge
```prisma
model Challenge {
  id              String   @id @default(uuid())
  title           String
  description     String
  doomThreshold   Int
  entryFee        Float
  startTime       DateTime
  endTime         DateTime
  status          ChallengeStatus
  totalPool       Float    @default(0)
  
  participants    Participant[]
}
```

### Participant
```prisma
model Participant {
  id              String   @id @default(uuid())
  userId          String
  challengeId     String
  averageUsage    Float?
  rank            Int?
  hasWon          Boolean  @default(false)
  
  user            User     @relation(fields: [userId], references: [id])
  challenge       Challenge @relation(fields: [challengeId], references: [id])
}
```

### ScreenTime
```prisma
model ScreenTime {
  id              String   @id @default(uuid())
  userId          String
  date            DateTime
  instagram       Int      @default(0)
  twitter         Int      @default(0)
  reddit          Int      @default(0)
  tiktok          Int      @default(0)
  total           Int      @default(0)
  
  user            User     @relation(fields: [userId], references: [id])
}
```

## ⏰ Cron Jobs

### Sync Challenges (Every 5 minutes)
```typescript
// Syncs challenge status with blockchain
cron.schedule('*/5 * * * *', async () => {
  await syncChallenges();
});
```

### Distribute Rewards (Every hour)
```typescript
// Distributes rewards to challenge winners
cron.schedule('0 * * * *', async () => {
  await distributeRewards();
});
```

## 🔐 Authentication Flow

1. **Client** sends wallet address and signed message
2. **Server** verifies signature using Solana Web3.js
3. **Server** checks if user exists in database
4. **Server** returns user data or signup required flag

```typescript
// Verify wallet signature
const message = `Sign this message to authenticate: ${timestamp}`;
const verified = nacl.sign.detached.verify(
  Buffer.from(message),
  Buffer.from(signature, 'base64'),
  publicKey.toBuffer()
);
```

## 🧪 Development

### Database Commands
```bash
# Create migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio

# Generate Prisma Client
npx prisma generate
```

### Testing
```bash
# Run tests
yarn test

# Run with coverage
yarn test:coverage
```

### Linting
```bash
yarn lint
```

## 🚀 Deployment

### Build for Production
```bash
yarn build
```

### Run Production Server
```bash
yarn start
```

### Using PM2
```bash
# Install PM2
npm install -g pm2

# Start server
pm2 start dist/index.js --name doomscroll-server

# Monitor
pm2 monit

# Logs
pm2 logs doomscroll-server
```

### Docker
```bash
# Build image
docker build -t doomscroll-server .

# Run container
docker run -p 3000:3000 --env-file .env doomscroll-server
```

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
pg_isready

# Test connection
psql -U postgres -d doomscroll

# Reset database
npx prisma migrate reset
```

### Prisma Issues
```bash
# Clear Prisma cache
rm -rf node_modules/.prisma

# Regenerate client
npx prisma generate
```

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

## 📊 Monitoring

### Health Check
```bash
curl http://localhost:3000/health
```

### Database Stats
```bash
curl http://localhost:3000/api/admin/stats
```

## 🤝 Contributing

1. Follow TypeScript best practices
2. Use Prisma for all database operations
3. Add proper error handling
4. Document new API endpoints
5. Write tests for new features

## 📄 License

MIT License - see the [LICENSE](../LICENSE) file for details.

---

<div align="center">

**Built with ⚡ using Express.js and Prisma**

</div>


# Doomscroll

![Doomscroll Banner](./client/assets/readme.png)

<div align="center">

**Break free from endless scrolling. Join challenges, compete with others, and win SOL rewards for building better digital habits.**

[![Solana](https://img.shields.io/badge/Solana-Devnet-9945FF?style=for-the-badge&logo=solana)](https://solana.com)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)

[Features](#-features) • [Demo](#-demo) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Architecture](#-architecture)

</div>

---

## 🎯 What is Doomscroll?

Doomscroll is a **Web3-powered digital wellness app** that helps users break free from social media addiction through **gamified challenges** and **financial incentives**. Built on Solana blockchain, it combines behavioral psychology with crypto economics to create lasting habit change.

### The Problem

- Average person spends **2.5+ hours daily** on social media
- Traditional screen time apps lack **accountability** and **motivation**
- No **financial incentive** to build better habits

### Our Solution

- 📊 **Automatic screen time tracking** across Instagram, Twitter, Reddit, and TikTok
- 🏆 **Competitive challenges** with real money on the line
- 💰 **Win SOL rewards** by staying under your doom limit
- 📈 **Live leaderboards** to keep you accountable
- 🔒 **Blockchain-verified** results - no cheating possible

---

## ✨ Features

### 🎮 Challenge System

- **Join Challenges**: Browse and join upcoming or active challenges with SOL entry fees
- **Multiple Durations**: 2-day weekend challenges to 30-day transformations
- **Custom Doom Limits**: Each challenge has a daily screen time threshold (e.g., 60 min/day)
- **Prize Pools**: Winners split the entire prize pool equally
- **Real-time Leaderboards**: See your rank and compete with others

### 📱 Screen Time Tracking

- **Automatic Monitoring**: Tracks Instagram, Twitter, Reddit, and TikTok usage
- **Daily Doom Meter**: Visual indicator showing if you're under or over your limit
- **Weekly Analytics**: See your usage patterns over time
- **Activity Rings**: Per-app breakdown of your daily usage

### 💎 Blockchain Integration

- **Solana Mobile Wallet Adapter**: Seamless Phantom wallet integration
- **On-chain Challenges**: All challenges stored on Solana blockchain
- **Transparent Rewards**: Automatic distribution via smart contracts
- **Devnet Ready**: Built for Solana devnet with mainnet-ready architecture

### 🎨 Beautiful UI/UX

- **Dark Theme**: Easy on the eyes for extended use
- **Smooth Animations**: Native-feeling transitions and interactions
- **Intuitive Navigation**: Bottom tab navigation with clear hierarchy
- **Motivational Design**: Encouraging messages and visual feedback

---

## 🎥 Demo

### User Journey

1. **Onboarding** → Connect Phantom wallet and set your doom limit
2. **Browse Challenges** → Explore upcoming and active challenges
3. **Join Challenge** → Pay entry fee (e.g., 0.5 SOL) via Phantom
4. **Track Progress** → Monitor your daily usage and leaderboard rank
5. **Win Rewards** → Stay under the limit and split the prize pool!

### Screenshots

- **Home Screen**: Doom meter, activity rings, weekly stats, and challenge progress
- **Challenges**: Browse, filter (Joined/Upcoming/All), and join challenges
- **Challenge Details**: Full info, leaderboard, daily progress calendar, and rules
- **Profile**: Stats, achievements, and wallet info

---

## 🛠 Tech Stack

### Mobile App (Client)

- **Framework**: React Native with Expo (SDK 52)
- **Language**: TypeScript
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Navigation**: React Navigation v6
- **State Management**: React Context + TanStack Query
- **Wallet**: Solana Mobile Wallet Adapter
- **Fonts**: Poppins (Google Fonts)

### Backend (Server)

- **Runtime**: Node.js with Express
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Solana wallet signature verification
- **Jobs**: Cron jobs for challenge sync and reward distribution
- **API**: RESTful endpoints with rate limiting

### Blockchain (Smart Contract)

- **Platform**: Solana (Anchor Framework)
- **Language**: Rust
- **Network**: Devnet (mainnet-ready)
- **Features**:
  - Create challenges
  - Join challenges
  - End challenges
  - Distribute rewards

---

## 🚀 Getting Started

### Prerequisites

```bash
# Node.js 18+
node --version

# Yarn or npm
yarn --version

# Solana CLI (for contract development)
solana --version

# Anchor (for contract development)
anchor --version

# PostgreSQL (for server)
psql --version
```

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/doomscroll.git
cd doomscroll
```

#### 2. Setup Database

```bash
# Start PostgreSQL with Docker
docker-compose up -d

# Run migrations
cd server
yarn install
npx prisma migrate dev
```

#### 3. Setup Server

```bash
cd server
yarn install

# Create .env file
cp .env.example .env

# Start server
yarn dev
```

#### 4. Setup Mobile App

```bash
cd client
yarn install

# Start Expo dev server
yarn start

# Run on Android (requires dev build)
yarn android
```

#### 5. Setup Smart Contract (Optional)

```bash
cd contract
yarn install

# Build contract
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet
```

---

## 📐 Architecture

### System Overview

```
┌─────────────────┐
│  Mobile App     │
│  (React Native) │
└────────┬────────┘
         │
         ├─────────────────┐
         │                 │
         ▼                 ▼
┌─────────────────┐  ┌──────────────┐
│  Backend API    │  │   Solana     │
│  (Express)      │  │  Blockchain  │
└────────┬────────┘  └──────────────┘
         │
         ▼
┌─────────────────┐
│   PostgreSQL    │
│   Database      │
└─────────────────┘
```

### Data Flow

1. **User connects wallet** → Mobile Wallet Adapter → Phantom
2. **User joins challenge** → Transaction sent to Solana → Entry fee deducted
3. **Screen time tracked** → Reported to backend → Stored in PostgreSQL
4. **Challenge ends** → Cron job triggers → Smart contract distributes rewards
5. **Winners receive SOL** → Automatic transfer to wallet

### Key Components

#### Mobile App Structure

```
client/
├── src/
│   ├── components/       # Reusable UI components
│   ├── screens/          # Screen components
│   ├── navigators/       # Navigation setup
│   ├── contexts/         # React Context providers
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API services
│   └── utils/            # Utility functions
├── assets/               # Images, fonts, etc.
└── app.json              # Expo configuration
```

#### Backend Structure

```
server/
├── src/
│   ├── routes/           # API route handlers
│   ├── middleware/       # Express middleware
│   ├── jobs/             # Cron jobs
│   └── services/         # Business logic
├── prisma/
│   └── schema.prisma     # Database schema
└── .env                  # Environment variables
```

#### Smart Contract Structure

```
contract/
├── programs/
│   └── doomscroll/
│       ├── src/
│       │   ├── lib.rs              # Main program
│       │   ├── state/              # Account structures
│       │   └── instructions/       # Program instructions
│       └── Cargo.toml
└── Anchor.toml           # Anchor configuration
```

---

## 🔑 Environment Variables

### Server (.env)

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/doomscroll"
PORT=3000
SOLANA_RPC_URL="https://api.devnet.solana.com"
SOLANA_PROGRAM_ID="your_program_id_here"
```

### Client (app.json)

```json
{
  "expo": {
    "name": "Doomscroll",
    "slug": "doomscroll",
    "scheme": "doomscroll"
  }
}
```

---

## 🎯 Roadmap

### Phase 1: MVP (Current)

- [x] Basic screen time tracking
- [x] Challenge creation and joining
- [x] Wallet integration
- [x] Leaderboard system
- [x] Reward distribution

### Phase 2: Enhanced Features

- [ ] Social features (friends, teams)
- [ ] Achievement badges and NFTs
- [ ] Custom challenge creation by users
- [ ] Advanced analytics dashboard
- [ ] Push notifications

### Phase 3: Scale

- [ ] Mainnet deployment
- [ ] iOS support
- [ ] Multi-chain support (Ethereum, Polygon)
- [ ] Partnership integrations
- [ ] Referral program

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

Built with ❤️ by the Doomscroll team

- **Kshitij** - Full Stack Developer & Blockchain Engineer

---

## 🙏 Acknowledgments

- [Solana Mobile Stack](https://solanamobile.com/) for wallet adapter
- [Expo](https://expo.dev/) for amazing mobile development tools
- [Anchor](https://www.anchor-lang.com/) for Solana smart contract framework
- [Phantom Wallet](https://phantom.app/) for seamless Web3 integration

---

## 📞 Contact

- **Website**: [doomscroll.com](https://doomscroll.com)
- **Twitter**: [@doomscrollapp](https://twitter.com/doomscrollapp)
- **Email**: hello@doomscroll.com

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with 💜 for the Solana ecosystem

</div>

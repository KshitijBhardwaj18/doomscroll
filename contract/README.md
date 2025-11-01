# Doomscroll Smart Contract

<div align="center">

**Solana smart contract for managing decentralized challenges and rewards**

[![Solana](https://img.shields.io/badge/Solana-9945FF?style=for-the-badge&logo=solana&logoColor=white)](https://solana.com)
[![Anchor](https://img.shields.io/badge/Anchor-000000?style=for-the-badge&logo=anchor&logoColor=white)](https://www.anchor-lang.com/)
[![Rust](https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white)](https://www.rust-lang.org/)

</div>

---

## 📋 Overview

The Doomscroll smart contract is a Solana program built with Anchor framework. It manages challenge creation, participant enrollment, challenge lifecycle, and automatic reward distribution in a decentralized manner.

## ✨ Features

### 🏆 Challenge Management
- **Create Challenges**: Initialize new challenges with custom parameters
- **Join Challenges**: Users can join by paying entry fees
- **End Challenges**: Automatically close challenges after end time
- **Status Tracking**: Active, ended, and cancelled states

### 💰 Financial Operations
- **Entry Fees**: Collect SOL from participants
- **Prize Pool**: Accumulate total challenge pool
- **Reward Distribution**: Distribute winnings to top performers
- **Refunds**: Handle cancellations and edge cases

### 🔐 Security
- **Authority Checks**: Only authorized users can perform actions
- **Time Validation**: Enforce start/end time constraints
- **Participant Limits**: Maximum participants per challenge
- **Reentrancy Protection**: Safe fund transfers

## 🛠 Tech Stack

- **Language**: Rust
- **Framework**: Anchor 0.29.0
- **Blockchain**: Solana
- **Tools**: Anchor CLI, Solana CLI

## 🚀 Getting Started

### Prerequisites

```bash
# Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Anchor CLI
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install 0.29.0
avm use 0.29.0
```

### Installation

1. **Clone and Navigate**
```bash
cd contract
```

2. **Install Dependencies**
```bash
yarn install
```

3. **Build Program**
```bash
anchor build
```

4. **Configure Solana**
```bash
# Set to devnet
solana config set --url devnet

# Create wallet (if needed)
solana-keygen new

# Airdrop SOL for testing
solana airdrop 2
```

5. **Deploy Program**
```bash
anchor deploy
```

## 📁 Project Structure

```
contract/
├── programs/
│   └── doomscroll/
│       └── src/
│           ├── lib.rs          # Main program logic
│           ├── state.rs        # Account structures
│           └── errors.rs       # Custom errors
├── tests/
│   └── doomscroll.ts          # Integration tests
├── target/
│   ├── deploy/                # Compiled program
│   └── idl/                   # Interface Definition Language
├── Anchor.toml                # Anchor configuration
└── Cargo.toml                 # Rust dependencies
```

## 📝 Program Instructions

### 1. Create Challenge
```rust
pub fn create_challenge(
    ctx: Context<CreateChallenge>,
    title: String,
    description: String,
    doom_threshold: u32,
    entry_fee: u64,
    start_time: i64,
    end_time: i64,
    max_participants: u32,
) -> Result<()>
```

**Parameters:**
- `title`: Challenge name
- `description`: Challenge details
- `doom_threshold`: Maximum allowed screen time (minutes)
- `entry_fee`: Cost to join (lamports)
- `start_time`: Unix timestamp for start
- `end_time`: Unix timestamp for end
- `max_participants`: Maximum number of participants

**Accounts:**
- `challenge`: Challenge PDA (created)
- `authority`: Challenge creator
- `system_program`: System program

### 2. Join Challenge
```rust
pub fn join_challenge(
    ctx: Context<JoinChallenge>,
) -> Result<()>
```

**Accounts:**
- `challenge`: Challenge PDA (mut)
- `participant`: Participant PDA (created)
- `user`: User joining
- `system_program`: System program

**Actions:**
- Transfers entry fee from user to challenge pool
- Creates participant account
- Increments participant count

### 3. End Challenge
```rust
pub fn end_challenge(
    ctx: Context<EndChallenge>,
) -> Result<()>
```

**Accounts:**
- `challenge`: Challenge PDA (mut)
- `authority`: Challenge creator

**Actions:**
- Validates end time has passed
- Updates challenge status to "Ended"
- Prepares for reward distribution

### 4. Distribute Rewards
```rust
pub fn distribute_rewards(
    ctx: Context<DistributeRewards>,
    winners: Vec<Pubkey>,
    shares: Vec<u64>,
) -> Result<()>
```

**Parameters:**
- `winners`: Array of winner public keys
- `shares`: Array of reward percentages (basis points)

**Accounts:**
- `challenge`: Challenge PDA (mut)
- `authority`: Challenge creator
- `system_program`: System program

**Actions:**
- Validates total shares = 10000 (100%)
- Transfers SOL to winners based on shares
- Marks challenge as completed

## 🗄 Account Structures

### Challenge Account
```rust
#[account]
pub struct Challenge {
    pub authority: Pubkey,          // Challenge creator
    pub title: String,              // Challenge name
    pub description: String,        // Challenge details
    pub doom_threshold: u32,        // Max screen time (minutes)
    pub entry_fee: u64,             // Entry cost (lamports)
    pub start_time: i64,            // Start timestamp
    pub end_time: i64,              // End timestamp
    pub status: ChallengeStatus,    // Current status
    pub total_pool: u64,            // Total prize pool
    pub participant_count: u32,     // Number of participants
    pub max_participants: u32,      // Maximum participants
    pub bump: u8,                   // PDA bump seed
}
```

### Participant Account
```rust
#[account]
pub struct Participant {
    pub user: Pubkey,               // User public key
    pub challenge: Pubkey,          // Challenge public key
    pub joined_at: i64,             // Join timestamp
    pub average_usage: Option<u32>, // Average screen time
    pub rank: Option<u32>,          // Final rank
    pub has_won: bool,              // Winner flag
    pub bump: u8,                   // PDA bump seed
}
```

### Challenge Status
```rust
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum ChallengeStatus {
    Active,      // Challenge is ongoing
    Ended,       // Challenge has ended
    Cancelled,   // Challenge was cancelled
    Completed,   // Rewards distributed
}
```

## 🔑 Program Derived Addresses (PDAs)

### Challenge PDA
```rust
seeds = [
    b"challenge",
    authority.key().as_ref(),
    title.as_bytes()
]
```

### Participant PDA
```rust
seeds = [
    b"participant",
    challenge.key().as_ref(),
    user.key().as_ref()
]
```

## 🧪 Testing

### Run Tests
```bash
anchor test
```

### Test Coverage
```bash
# Run with logs
anchor test -- --nocapture

# Run specific test
anchor test --skip-build -- test_name
```

### Example Test
```typescript
it("Creates a challenge", async () => {
  const tx = await program.methods
    .createChallenge(
      "7-Day Detox",
      "Reduce screen time for 7 days",
      60, // 60 minutes threshold
      new anchor.BN(500000000), // 0.5 SOL
      startTime,
      endTime,
      100 // max participants
    )
    .accounts({
      challenge: challengePda,
      authority: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .rpc();
  
  const challenge = await program.account.challenge.fetch(challengePda);
  assert.equal(challenge.title, "7-Day Detox");
});
```

## 🚀 Deployment

### Devnet Deployment
```bash
# Build
anchor build

# Deploy
anchor deploy --provider.cluster devnet

# Get program ID
solana address -k target/deploy/doomscroll-keypair.json
```

### Mainnet Deployment
```bash
# Switch to mainnet
solana config set --url mainnet-beta

# Ensure sufficient SOL for deployment
solana balance

# Deploy
anchor deploy --provider.cluster mainnet-beta
```

### Update Program ID
After deployment, update `lib.rs` and `Anchor.toml`:

```rust
// lib.rs
declare_id!("YOUR_PROGRAM_ID_HERE");
```

```toml
# Anchor.toml
[programs.devnet]
doomscroll = "YOUR_PROGRAM_ID_HERE"
```

## 🔍 Verification

### Verify Deployment
```bash
# Check program account
solana program show <PROGRAM_ID>

# Get program data
anchor idl fetch <PROGRAM_ID>
```

### Interact with Program
```bash
# Using Anchor client
anchor run test-script

# Using Solana CLI
solana program invoke <PROGRAM_ID> --data <INSTRUCTION_DATA>
```

## 🐛 Troubleshooting

### Build Errors
```bash
# Clean build artifacts
anchor clean

# Rebuild
anchor build
```

### Deployment Failures
```bash
# Check balance
solana balance

# Airdrop more SOL (devnet)
solana airdrop 2

# Increase compute units
anchor deploy --provider.cluster devnet -- --max-compute-units 200000
```

### Account Size Issues
```rust
// Increase space allocation in account macro
#[account(space = 8 + 1024)] // Adjust size as needed
```

## 📊 Program Costs

### Devnet (Free)
- Deployment: Free (airdrop SOL)
- Transactions: Free

### Mainnet
- Deployment: ~5-10 SOL (depends on program size)
- Account Creation: ~0.002 SOL per account
- Transactions: ~0.000005 SOL per transaction

## 🔐 Security Considerations

### Best Practices
1. **Validate All Inputs**: Check bounds and constraints
2. **Use PDAs**: Avoid user-provided account addresses
3. **Check Signers**: Verify authority on sensitive operations
4. **Time Validation**: Enforce start/end time constraints
5. **Overflow Protection**: Use checked arithmetic
6. **Reentrancy Guards**: Prevent double-spending

### Audit Checklist
- [ ] All instructions have proper authority checks
- [ ] PDAs are correctly derived and validated
- [ ] No integer overflow/underflow vulnerabilities
- [ ] Proper error handling for all edge cases
- [ ] Time-based logic is secure
- [ ] Fund transfers are atomic and safe

## 🤝 Contributing

1. Follow Rust and Anchor best practices
2. Add tests for new instructions
3. Document all public functions
4. Update IDL after changes
5. Test on devnet before mainnet deployment

## 📚 Resources

- [Anchor Book](https://book.anchor-lang.com/)
- [Solana Cookbook](https://solanacookbook.com/)
- [Solana Documentation](https://docs.solana.com/)
- [Anchor Examples](https://github.com/coral-xyz/anchor/tree/master/examples)

## 📄 License

MIT License - see the [LICENSE](../LICENSE) file for details.

---

<div align="center">

**Built with 🦀 using Anchor Framework**

</div>


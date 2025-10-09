use anchor_lang::prelude::*;

declare_id!("11111111111111111111111111111112");

// Module declarations
pub mod state;
pub mod instructions;
pub mod errors;

// Import instruction handlers and contexts
use instructions::{
    create_challenge::*,
    join_challenge::*,
    end_challenge::*,
    distribute_rewards::*,
};

#[program]
pub mod doomscroll {
    use super::*;

    /// Creator initializes a new challenge with entry fee, time bounds, etc.
    pub fn create_challenge(
        ctx: Context<CreateChallenge>,
        entry_fee: u64,
        doom_threshold_minutes: u64,
        start_time: i64,
        end_time: i64,
    ) -> Result<()> {
        instructions::create_challenge::create_challenge(
            ctx,
            entry_fee,
            doom_threshold_minutes,
            start_time,
            end_time,
        )
    }

    /// Participant joins and transfers lamports to escrow PDA.
    pub fn join_challenge(ctx: Context<JoinChallenge>) -> Result<()> {
        instructions::join_challenge::join_challenge(ctx)
    }

    /// Optionally mark challenge ended (callable by creator or verifier)
    pub fn end_challenge(ctx: Context<EndChallenge>) -> Result<()> {
        instructions::end_challenge::end_challenge(ctx)
    }

    /// Distribute rewards to winners. Only the verifier key can call this.
    /// winners are passed as participant accounts in the accounts array (variable length)
    pub fn distribute_rewards<'info>(ctx: Context<'_, '_, '_, 'info, DistributeRewards<'info>>) -> Result<()> {
        instructions::distribute_rewards::distribute_rewards(ctx)
    }
}






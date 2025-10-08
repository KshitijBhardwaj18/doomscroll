use anchor_lang::prelude::*;
use crate::state::{Challenge, ChallengeStatus};

pub fn create_challenge(
    ctx: Context<CreateChallenge>,
    entry_fee: u64,
    doom_threshold_minutes: u64,
    start_time: i64,
    end_time: i64,
) -> Result<()> {
    let challenge = &mut ctx.accounts.challenge;
    challenge.creator = *ctx.accounts.creator.key;
    challenge.entry_fee = entry_fee;
    challenge.doom_threshold_minutes = doom_threshold_minutes;
    challenge.start_time = start_time;
    challenge.end_time = end_time;
    challenge.total_pool = 0;
    challenge.participant_count = 0;
    challenge.verifier = *ctx.accounts.verifier.key;
    challenge.status = ChallengeStatus::Active as u8;
    challenge.bump = *ctx.bumps.get("challenge").unwrap();
    Ok(())
}

#[derive(Accounts)]
#[instruction(entry_fee: u64, doom_threshold_minutes: u64, start_time: i64, end_time: i64)]
pub struct CreateChallenge<'info> {
    #[account(init, payer = creator, space = Challenge::space(), seeds = [b"challenge", creator.key().as_ref(), &[0u8]], bump)]
    /// CHECK: seeds bumped in runtime with bump passed implicitly — we'll recompute bump via ctx.bumps
    pub challenge: Account<'info, Challenge>,

    #[account(mut)]
    pub creator: Signer<'info>,

    /// The account which will be allowed to call distribute_rewards (your backend key)
    /// This can be a PDA or normal keypair; keep it secure.
    pub verifier: UncheckedAccount<'info>,

    /// system program
    pub system_program: Program<'info, System>,
}
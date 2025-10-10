use anchor_lang::prelude::*;
use crate::state::{Challenge,GlobalCounter};
use crate::state::challenge::ChallengeStatus;
use crate::errors::ErrorCode;


pub fn create_challenge(
    ctx: Context<CreateChallenge>,
    entry_fee: u64,
    doom_threshold_minutes: u64,
    start_time: i64,
    end_time: i64,
) -> Result<()> {
    let counter = &mut ctx.accounts.global_counter;
    let challenge_id = counter.challenge_count;

    let challenge = &mut ctx.accounts.challenge;
    challenge.id = challenge_id;
    challenge.creator = *ctx.accounts.creator.key;
    challenge.entry_fee = entry_fee;
    challenge.doom_threshold_minutes = doom_threshold_minutes;
    challenge.start_time = start_time;
    challenge.end_time = end_time;
    challenge.participant_count = 0;
    challenge.verifier = *ctx.accounts.verifier.key;
    challenge.status =  ChallengeStatus::Active as u8;
    challenge.bump = ctx.bumps.challenge;

    counter.challenge_count = counter.challenge_count.checked_add(1).ok_or(error!(ErrorCode::Overflow))?;
    Ok(())
}

#[derive(Accounts)]
#[instruction(challenge_id:u8,entry_fee: u64, doom_threshold_minutes: u64, start_time: i64, end_time: i64)]
pub struct CreateChallenge<'info> {

    #[account(
        init_if_needed,
        payer = creator,
        space = GlobalCounter::LEN,
        seeds = [b"global_counter"],
        bump
    )]
    pub global_counter: Account<'info, GlobalCounter>,


    #[account(init, payer = creator, space = Challenge::space(), seeds = [b"challenge", creator.key().as_ref(), &[challenge_id]], bump)]
    /// CHECK: seeds bumped in runtime with bump passed implicitly — we'll recompute bump via ctx.bumps
    pub challenge: Account<'info, Challenge>,

    #[account(mut)]
    pub creator: Signer<'info>,
    /// CHECK: The verifier is an arbitrary account that will be allowed to call distribute_rewards.
    /// The account which will be allowed to call distribute_rewards (your backend key)
    /// This can be a PDA or normal keypair; keep it secure.
    pub verifier: UncheckedAccount<'info>,

    /// system program
    pub system_program: Program<'info, System>,
}
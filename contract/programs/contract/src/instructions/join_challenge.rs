use anchor_lang::prelude::*;
use anchor_lang::solana_program::{system_instruction, program::invoke_signed};
use crate::state::{Challenge, ChallengeStatus, Participant};
use crate::ErrorCode;

pub fn join_challenge(ctx: Context<JoinChallenge>) -> Result<()> {
    let challenge = &mut ctx.accounts.challenge;
    require!(
        challenge.status == ChallengeStatus::Active as u8,
        ErrorCode::ChallengeNotActive
    );

    // transfer lamports (entry_fee) from participant payer to escrow PDA account
    let ix = system_instruction::transfer(
        ctx.accounts.payer.key,
        ctx.accounts.escrow.key,
        challenge.entry_fee,
    );

    // payer (signer) will sign the TX, so no invoke_signed needed here
    invoke_signed(
        &ix,
        &[
            ctx.accounts.payer.to_account_info(),
            ctx.accounts.escrow.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
        &[],
    )?;

    // create participant account (already created in accounts constraints)
    let participant = &mut ctx.accounts.participant;
    participant.user = *ctx.accounts.payer.key;
    participant.deposited = challenge.entry_fee;
    participant.disqualified = false;
    participant.challenge = ctx.accounts.challenge.key();
    participant.bump = *ctx.bumps.get("participant").unwrap();

    // update challenge totals
    challenge.total_pool = challenge
        .total_pool
        .checked_add(challenge.entry_fee)
        .ok_or(ErrorCode::Overflow)?;
    challenge.participant_count = challenge
        .participant_count
        .checked_add(1)
        .ok_or(ErrorCode::Overflow)?;

    Ok(())
}


#[derive(Accounts)]
pub struct JoinChallenge<'info> {
    #[account(mut, seeds = [b"challenge", challenge.creator.as_ref(), &[challenge.bump]], bump = challenge.bump)]
    pub challenge: Account<'info, Challenge>,

    /// Participant payer (signer)
    #[account(mut)]
    pub payer: Signer<'info>,

    /// Participant PDA account to create, associated with challenge + user
    /// Seed: ["participant", challenge_key, user_pubkey]
    #[account(init, payer = payer, space = Participant::space(), seeds = [b"participant", challenge.key().as_ref(), payer.key.as_ref()], bump)]
    pub participant: Account<'info, Participant>,

    /// Escrow account (PDA) where all join deposits are collected
    /// This is a system account, created beforehand during challenge creation or created on-demand.
    /// We assume it exists and is a PDA with seeds ["escrow", challenge.key()]
    /// Mark as mut because we'll accept lamports into it
    #[account(mut, seeds = [b"escrow", challenge.key().as_ref()], bump = challenge.escrow_bump())]
    /// CHECK: Escrow is a system account
    pub escrow: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}
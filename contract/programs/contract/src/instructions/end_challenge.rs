use anchor_lang::prelude::*;
use crate::state::{Challenge, ChallengeStatus};
use crate::errors::ErrorCode;

pub fn end_challenge(ctx: Context<EndChallenge>) -> Result<()> {
    let challenge = &mut ctx.accounts.challenge;
    require!(
        challenge.status == ChallengeStatus::Active as u8,
        ErrorCode::ChallengeNotActive
    );

    // allow creator or verifier to end
    let caller = ctx.accounts.signer.key();
    require!(
        caller == challenge.creator || caller == challenge.verifier,
        ErrorCode::Unauthorized
    );

    challenge.status = ChallengeStatus::Ended as u8;
    Ok(())
}

#[derive(Accounts)]
pub struct EndChallenge<'info> {
    #[account(mut, seeds = [b"challenge", challenge.creator.as_ref(), &[challenge.bump]], bump = challenge.bump)]
    pub challenge: Account<'info, Challenge>,

    /// Anyone who is creator or verifier can call to end (signer check in handler)
    pub signer: Signer<'info>,
}

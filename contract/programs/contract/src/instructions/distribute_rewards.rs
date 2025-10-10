use anchor_lang::prelude::*;
use anchor_lang::solana_program::{system_instruction, program::invoke_signed};
use borsh::BorshDeserialize;
use crate::state::{Challenge, ChallengeStatus, Participant};
use crate::errors::ErrorCode;

fn try_from_slice_unchecked<T: BorshDeserialize>(data: &[u8]) -> Result<T> {
    T::try_from_slice(data).map_err(|_| error!(ErrorCode::AccountDeserializeError))
}

// Note the explicit lifetime parameter 'info here
pub fn distribute_rewards<'info>(ctx: Context<'_, '_, '_, 'info, DistributeRewards<'info>>) -> Result<()> {
    require!(
        ctx.accounts.challenge.status == ChallengeStatus::Ended as u8,
        ErrorCode::ChallengeNotEnded
    );

    // ensure caller is the verifier
    require!(
        ctx.accounts.verifier.key() == ctx.accounts.challenge.verifier,
        ErrorCode::Unauthorized
    );

    // Admin (verifier) passes list of winner participant accounts in remaining_accounts
    // Anyone not in this list is effectively disqualified
    let winners_count = ctx.remaining_accounts.len() as u64;
    require!(winners_count > 0, ErrorCode::NoWinnersProvided);

    // calculate total pool = participant_count * entry_fee
    let total_pool = ctx
        .accounts
        .challenge
        .participant_count
        .checked_mul(ctx.accounts.challenge.entry_fee as u32)
        .ok_or(ErrorCode::Overflow)? as u64;

    // calculate share = total_pool / winners_count
    let share = total_pool
        .checked_div(winners_count)
        .ok_or(ErrorCode::DivideByZero)?;

    let challenge_key = ctx.accounts.challenge.key();
    let escrow_bump = ctx.bumps.escrow;

    // Iterate through winner participant accounts  
    let num_winners = ctx.remaining_accounts.len();
    for i in 0..num_winners {
        let participant_ai = &ctx.remaining_accounts[i];
        
        // deserialize participant account
        let participant_data: Participant =
            try_from_slice_unchecked(&participant_ai.data.borrow())?;

        // verify participant belongs to this challenge and has deposited > 0
        require!(
            participant_data.challenge == challenge_key,
            ErrorCode::ParticipantMismatch
        );
        require!(participant_data.deposited > 0, ErrorCode::NoDepositForParticipant);

        // escrow PDA seeds
        let escrow_seeds: &[&[u8]] = &[
            b"escrow",
            challenge_key.as_ref(),
            &[escrow_bump],
        ];

        // Transfer share from escrow PDA directly to participant
        let ix = system_instruction::transfer(&ctx.accounts.escrow.key(), &participant_data.user, share);

        // invoke_signed: escrow PDA is program-derived and must sign
        invoke_signed(
            &ix,
            &[
                ctx.accounts.escrow.to_account_info(),
                participant_ai.clone(),
                ctx.accounts.system_program.to_account_info(),
            ],
            &[escrow_seeds],
        )?;
    }

    // mark distributed
    ctx.accounts.challenge.status = ChallengeStatus::Distributed as u8;

    Ok(())
}


#[derive(Accounts)]
pub struct DistributeRewards<'info> {
    #[account(mut)]
    pub challenge: Account<'info, Challenge>,
    /// CHECK: The escrow  is an arbitrary account that will be allowed to call distribute_rewards.
    /// The account which will be allowed to call distribute_rewards (your backend key)
    /// This can be a PDA or normal keypair; keep it secure.
    #[account(mut, seeds = [b"escrow", challenge.key().as_ref()], bump )]
    pub escrow: UncheckedAccount<'info>,

    pub verifier: Signer<'info>,

    pub system_program: Program<'info, System>,
}

use anchor_lang::prelude::*;
use anchor_lang::solana_program::{system_instruction, program::invoke_signed};
use anchor_lang::AccountDeserialize;
use crate::state::{Challenge, ChallengeStatus, Participant};
use crate::errors::ErrorCode;

// NOTE: We use Anchor's AccountDeserialize below to read Participant from raw AccountInfo

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

    // Admin (verifier) passes winners as PAIRS in remaining_accounts:
    // [participant_pda_0, user_system_0, participant_pda_1, user_system_1, ...]
    // Validate non-empty and even length
    let rem_len = ctx.remaining_accounts.len();
    require!(rem_len > 0, ErrorCode::NoWinnersProvided);
    require!(rem_len % 2 == 0, ErrorCode::AccountDeserializeError);
    let winners_count = (rem_len / 2) as u64;

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

    // Iterate over winner pairs
    for i in 0..(winners_count as usize) {
        let participant_ai = &ctx.remaining_accounts[2 * i];
        let user_ai = &ctx.remaining_accounts[2 * i + 1];

        // Deserialize participant account using Anchor
        let mut data_slice = &participant_ai.data.borrow()[..];
        let participant_data = Participant::try_deserialize_unchecked(&mut data_slice)
            .map_err(|_| error!(ErrorCode::AccountDeserializeError))?;

        // Verify participant belongs to this challenge and has a deposit
        require!(participant_data.challenge == challenge_key, ErrorCode::ParticipantMismatch);
        require!(participant_data.deposited > 0, ErrorCode::NoDepositForParticipant);
        // Verify the provided user system account matches participant.user
        require!(participant_data.user == user_ai.key(), ErrorCode::ParticipantMismatch);

        // escrow PDA seeds
        let escrow_seeds: &[&[u8]] = &[
            b"escrow",
            challenge_key.as_ref(),
            &[escrow_bump],
        ];

        // Transfer share from escrow PDA directly to user's system account
        let ix = system_instruction::transfer(&ctx.accounts.escrow.key(), &user_ai.key(), share);

        // invoke_signed: escrow PDA is program-derived and must sign
        invoke_signed(
            &ix,
            &[
                ctx.accounts.escrow.to_account_info(),
                user_ai.clone(),
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

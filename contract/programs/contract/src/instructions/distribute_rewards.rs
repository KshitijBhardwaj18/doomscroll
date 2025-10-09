use anchor_lang::prelude::*;
use anchor_lang::solana_program::{system_instruction, program::invoke_signed};
use borsh::BorshDeserialize;
use crate::state::{Challenge, ChallengeStatus, Participant};
use crate::ErrorCode;

fn try_from_slice_unchecked<T: BorshDeserialize>(data: &[u8]) -> Result<T> {
    T::try_from_slice(data).map_err(|_| error!(ErrorCode::AccountDeserializeError))
}

pub fn distribute_rewards(ctx: Context<DistributeRewards>) -> Result<()> {
    let challenge = &mut ctx.accounts.challenge;

    require!(
        challenge.status == ChallengeStatus::Ended as u8,
        ErrorCode::ChallengeNotEnded
    );

    // ensure caller is the verifier
    require!(
        ctx.accounts.verifier.key() == challenge.verifier,
        ErrorCode::Unauthorized
    );

    // gather winner participant accounts from remaining_accounts
    let rem = ctx.remaining_accounts;
    let mut winners_count: u64 = 0;

    // We'll expect pairs: [participant_account, winner_system_account] repeating
    // remaining_accounts length must be even and >= 2
    require!(rem.len() % 2 == 0 && rem.len() >= 2, ErrorCode::InvalidWinnersAccounts);

    winners_count = (rem.len() / 2) as u64;

    require!(winners_count > 0, ErrorCode::NoWinnersProvided);

    // calculate share = total_pool / winners_count
    let share = challenge
        .total_pool
        .checked_div(winners_count)
        .ok_or(ErrorCode::DivideByZero)?;

    // escrow PDA seeds
    let escrow_seeds: &[&[u8]] = &[
        b"escrow",
        challenge.key().as_ref(),
        &[challenge.escrow_bump()],
    ];

    // Iterate pairs and validate each participant
    for i in 0..(rem.len() / 2) {
        let part_idx = i * 2;
        let participant_ai = &rem[part_idx];
        let receiver_ai = &rem[part_idx + 1];

        // deserialize participant account
        let participant_data: Participant =
            try_from_slice_unchecked(&participant_ai.data.borrow())?;

        // verify participant belongs to this challenge and has deposited > 0
        require!(
            participant_data.challenge == challenge.key(),
            ErrorCode::ParticipantMismatch
        );
        require!(participant_data.deposited > 0, ErrorCode::NoDepositForParticipant);
        require!(!participant_data.disqualified, ErrorCode::ParticipantDisqualified);

        // Transfer share from escrow PDA to receiver
        let ix = system_instruction::transfer(&ctx.accounts.escrow.key(), &receiver_ai.key(), share);
        // invoke_signed: escrow PDA is program-derived and must sign
        invoke_signed(
            &ix,
            &[
                ctx.accounts.escrow.to_account_info(),
                receiver_ai.clone(),
                ctx.accounts.system_program.to_account_info(),
            ],
            &[escrow_seeds],
        )?;
    }

    // mark distributed
    challenge.status = ChallengeStatus::Distributed as u8;

    Ok(())
}


#[derive(Accounts)]
pub struct DistributeRewards<'info> {
    #[account(mut)]
    pub challenge: Account<'info, Challenge>,

    /// The escrow PDA account
    /// We will sign as escrow via PDA seeds when transferring lamports out
    #[account(mut, seeds = [b"escrow", challenge.key().as_ref()], bump = challenge.escrow_bump())]
    /// CHECK: escrow is system account PDA that holds lamports
    pub escrow: UncheckedAccount<'info>,

    /// Verifier signer (must match challenge.verifier)
    pub verifier: Signer<'info>,

    /// System program
    pub system_program: Program<'info, System>,

    // NOTE: Winner participant accounts and receiver system accounts are passed in `remaining_accounts`.
    // Pairs: [participant_account1, receiver_pubkey_account1, participant_account2, receiver_pubkey_account2, ...]
    // The runtime will provide them in ctx.remaining_accounts
}
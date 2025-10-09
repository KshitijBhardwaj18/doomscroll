use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Challenge is not active")]
    ChallengeNotActive,
    #[msg("Challenge is not ended")]
    ChallengeNotEnded,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Overflow")]
    Overflow,
    #[msg("Participant does not belong to challenge")]
    ParticipantMismatch,
    #[msg("Participant has no deposit")]
    NoDepositForParticipant,
    #[msg("Participant is disqualified")]
    ParticipantDisqualified,
    #[msg("Account deserialization failed")]
    AccountDeserializeError,
    #[msg("Invalid winners accounts provided")]
    InvalidWinnersAccounts,
    #[msg("No winners provided")]
    NoWinnersProvided,
    #[msg("Divide by zero")]
    DivideByZero,
    #[msg("Challenge already started")]
    ChallengeAlreadyStarted,
}
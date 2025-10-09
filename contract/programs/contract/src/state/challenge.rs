use anchor_lang::prelude::*;

#[account]
pub struct Challenge {
    pub id: u8,                      // 1
    pub creator: Pubkey,             // 32
    pub entry_fee: u64,              // 8
    pub doom_threshold_minutes: u64, // 8
    pub start_time: i64,             // 8
    pub end_time: i64,               // 8       
    pub participant_count: u32,      // 4
    pub verifier: Pubkey,           // 32
    pub status: u8,                 // 1
    pub bump: u8,                   // 1
}

impl Challenge {
    
    pub fn space() -> usize {
        8  // discriminator
        + 1  // id
        + 32 // creator
        + 8  // entry_fee
        + 8  // doom_threshold_minutes
        + 8  // start_time
        + 8  // end_time
        + 4  // Vec length prefix
        + 4  // participant_count
        + 32 // verifier
        + 1  // status
        + 1  // bump
    }
}

#[repr(u8)]
pub enum ChallengeStatus {
    Active = 0,
    Ended = 1,
    Distributed = 2,
}

use anchor_lang::prelude::*;

#[account]
pub struct Challenge {
    pub creator: Pubkey,         // 32
    pub entry_fee: u64,          // 8
    pub doom_threshold: u64,     // 8
    pub start_time: i64,         // 8
    pub end_time: i64,           // 8       
    pub participant: Vec<Pubkey>,
    pub participant_count: u32,  // 4
    pub verifier: Pubkey,        // 32
    pub status: u8,              // 1
    pub bump: u8,                // 1
}

impl Challenge {
    pub fn space() -> usize {
        // 8 discriminator + fields
        8 + 32 + 8 + 8 + 8 + 8 + 8 + 4 + 32 + 1 + 1 + 16
    }

    pub fn escrow_bump(&self) -> u8 {
        self.bump
    }
}

#[repr(u8)]
pub enum ChallengeStatus {
    Active = 0,
    Ended = 1,
    Distributed = 2,
}

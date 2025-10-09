use anchor_lang::prelude::*;

#[account]
pub struct Participant {
    pub user: Pubkey,
    pub challenge: Pubkey,
    pub deposited: u64,
    pub joined_at: i64,
    pub disqualified: bool,
    pub bump: u8
}

impl Participant {
    pub const Len: usize = 8 + 32 + 32 + 8 + 8 + 1 + 1;
    pub fn space() -> usize {
        Self::LEN
    }
}
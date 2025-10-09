use anchor_lang::prelude::*;

#[account]
pub struct GlobalCounter {
    pub challenge_count: u8,
}

impl GlobalCounter {
    pub const LEN: usize = 8 + 8; // discriminator + u64
}
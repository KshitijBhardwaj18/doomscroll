#[account]
pub struct GlobalCounter {
    pub challenge_count: u64,
}

impl GlobalCounter {
    pub const LEN: usize = 8 + 8; // discriminator + u64
}
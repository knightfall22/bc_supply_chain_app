use anchor_lang::prelude::*;

#[event]
pub struct CustodyAccepted {
    pub product: Pubkey,
    pub from: Pubkey,
    pub to: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct CustodyTransferredInitiated {
    pub product: Pubkey,
    pub from: Pubkey,
    pub to: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct ProductCreated {
    pub product: Pubkey,
    pub by: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct ProductAuthenticated {
    pub product: Pubkey,
    pub by: Pubkey,
    pub seal: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct ProductDelivered {
    pub product: Pubkey,
    pub from: Pubkey,
    pub to: Pubkey,
    pub timestamp: i64,
}
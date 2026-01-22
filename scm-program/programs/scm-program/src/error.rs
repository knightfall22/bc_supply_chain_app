use anchor_lang::prelude::*;

#[error_code]
pub enum CustomError {
    #[msg("not current custodian")]
    NotCurrentCustodian,

    #[msg("invalid transfer")]
    InvalidCustodianTransfer,

    #[msg("cannot sign for this product")]
    NotPendingCustodian,

    #[msg("no custodian is pending")]
    NoPendingCustodian,

    #[msg("product is not authenticated")]
    NotAuthenticated
}

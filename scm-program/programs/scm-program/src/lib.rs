pub mod constants;
pub mod error;
pub mod instructions;
pub mod admin;
pub mod state;
pub mod utils;
pub mod events;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;
pub use events::*;
pub use admin::*;

declare_id!("G6jHWjRMTx4Gz98hY1UysdzAvuysutDxVYkvbiKxe2Ak");

#[program]
pub mod scm_program {
    use super::*;

  pub fn register_organization(ctx: Context<RegisterOrganization>, name: String) -> Result<()> {
        process_register_organization(ctx, name)

    }

    pub fn register_participants(
        ctx: Context<RegisterParticipant>, 
        address: Pubkey, 
        name: String, 
        role: Role
    ) -> Result<()> {
        process_register_participant(ctx, address, name, role)
    }

    pub fn create_product(
        ctx: Context<CreateProduct>, 
        product_id: [u8; 16],
        batch_number: [u8; 16],
        name: String,
        quantity: u64,
        asset_args: CreateProductAssetArgs
    ) -> Result<()> {
        process_create_product(ctx, product_id, batch_number, name,quantity, asset_args)
    }

    pub fn accept_transfer(ctx: Context<AcceptProduct>) -> Result<()> {
        process_accept_product(ctx)
    }

    pub fn toggle_verification(ctx: Context<UpdateParticipant>) -> Result<()> {
        process_toggle_participant_verification(ctx)
    }

    pub fn update_role(ctx: Context<UpdateParticipant>, role: Role) -> Result<()> {
        process_update_participant_role(ctx, role)
    }

    pub fn update_name(ctx: Context<UpdateParticipant>, name: String) -> Result<()> {
        process_update_participant_name(ctx, name)
    }

    pub fn initiate_transfer(ctx: Context<TransferProduct>, address: Pubkey) -> Result<()> {
        process_initiate_transfer(ctx, address)
    }

    pub fn create_seal(ctx: Context<CreateSeal>, args: CreateAssetArgs) -> Result<()> {
        process_create_seal(ctx, args)
    }
}

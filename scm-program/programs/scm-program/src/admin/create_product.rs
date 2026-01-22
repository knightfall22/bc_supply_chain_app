use anchor_lang::prelude::*;
use mpl_core::{
    ID as MPL_CORE_ID,
    instructions::CreateV2CpiBuilder, 
};

use crate::{
 EVENT_ACCOUNT, Event, EventType, ORGANIZATION_ACCOUNT, Organization, PARTICIPANTS_ACCOUNT, PRODUCT_ACCOUNT, Participant, Product, ProductCreated
};

#[derive(Accounts)]
#[instruction(product_id: [u8; 16])]
pub struct CreateProduct<'info> {
    #[account(mut)]
    pub asset: Signer<'info>,
    
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut, 
        seeds = [ORGANIZATION_ACCOUNT.as_bytes(), authority.key().as_ref()],
        has_one = authority,
        bump = organization.bump
    )]
    pub organization: Account<'info, Organization>,

    #[account(
        init,
        payer = authority,
        space = 8 + Product::INIT_SPACE,
        seeds = [PRODUCT_ACCOUNT.as_bytes(), organization.key().as_ref(), product_id.as_ref()],
        bump
    )]
    pub product: Account<'info, Product>,

    #[account(
        seeds = [
            PARTICIPANTS_ACCOUNT.as_bytes(),
            organization.key().as_ref(),
            authority.key().as_ref()
        ],
        bump = participant.bump
    )]
    pub participant: Account<'info, Participant>,

    #[account(
        init,
        payer = authority,
        seeds = [
            EVENT_ACCOUNT.as_bytes(),
            product_id.as_ref(),
            0u64.to_le_bytes().as_ref(),
        ],
        space = 8 + Event::INIT_SPACE,
        bump
    )]
    pub event: Account<'info, Event>,


    #[account(address = MPL_CORE_ID)]
    /// CHECK: this account is checked by the address constraint
    pub mpl_core_program: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateProductAssetArgs {
   name: String,
   uri: String,
}

pub fn process_create_product(
    ctx: Context<CreateProduct>, 
    product_id: [u8; 16],
    batch_number: [u8; 16],
    name: String,
    quantity: u64,
    asset_args: CreateProductAssetArgs
) -> Result<()> {
    let product = &mut ctx.accounts.product;
    product.name = name;
    product.organization = ctx.accounts.organization.key();
    product.product_id = product_id;
    product.batch_number = batch_number;
    product.bump = ctx.bumps.product;
    product.quantity = quantity;
    product.custodian.participant = ctx.accounts.participant.key();
    product.custodian.role = ctx.accounts.participant.role.clone();
    product.custodian.custodian_wallet = ctx.accounts.participant.address;
    product.event_index_count = 0;
    product.event_index_count += 1;
    product.created_at = Clock::get()?.unix_timestamp;
    product.asset = ctx.accounts.asset.key();
    
    
    let event = &mut ctx.accounts.event;
    event.product = product.key();
    event.event_index = 0;
    event.bump = ctx.bumps.event;
    event.producer = ctx.accounts.participant.key();
    event.event_type = EventType::Created;
    event.timestamp = Clock::get()?.unix_timestamp;
    

    let seeds = &[
        PARTICIPANTS_ACCOUNT.as_bytes(),
        product.organization.as_ref(),
        product.custodian.custodian_wallet.as_ref(),
        &[ctx.accounts.participant.bump]
   ];


    
    let custodian_signer_seeds = [&seeds[..]];

    CreateV2CpiBuilder::new(
        &ctx.accounts.mpl_core_program.to_account_info(),
    )
    .asset(&ctx.accounts.asset)
    .authority(Some(&ctx.accounts.authority.to_account_info()))
    .collection(None)
    .payer(&ctx.accounts.authority)
    .owner(Some(&ctx.accounts.participant.to_account_info()))
    .system_program(&ctx.accounts.system_program.to_account_info())
    .update_authority(Some(&ctx.accounts.participant.to_account_info()))
    .name(asset_args.name)
    .uri(asset_args.uri)
    .invoke_signed(&custodian_signer_seeds)?;

    emit!(ProductCreated{
        product: product.key(),
        by: ctx.accounts.participant.key(),
        timestamp: Clock::get()?.unix_timestamp
    });

    Ok(())
}
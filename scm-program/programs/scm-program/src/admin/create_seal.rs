use anchor_lang::prelude::*;
use mpl_core::{
    ID as MPL_CORE_ID,
    instructions::CreateV2CpiBuilder,
    types::{ FreezeDelegate, Plugin, PluginAuthorityPair },
};

use crate::{
    EVENT_ACCOUNT,
    Event,
    EventType,
    ORGANIZATION_ACCOUNT,
    Organization,
    PARTICIPANTS_ACCOUNT,
    Participant,
    Product, ProductAuthenticated,
};

#[derive(Accounts)]
pub struct CreateSeal<'info> {
    #[account(mut)]
    pub asset: Signer<'info>,

    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(mut)]
    pub product: Account<'info, Product>,

    #[account(
        mut, 
        seeds = [ORGANIZATION_ACCOUNT.as_bytes(), authority.key().as_ref()],
        has_one = authority,
        bump = organization.bump
    )]
    pub organization: Account<'info, Organization>,

    #[account(
        seeds = [
            PARTICIPANTS_ACCOUNT.as_bytes(),
            organization.key().as_ref(),
            authority.key().as_ref(),
        ],
        bump = participant.bump
    )]
    pub participant: Account<'info, Participant>,

    #[account(
        init,
        payer = authority,
        seeds = [
            EVENT_ACCOUNT.as_bytes(),
            product.product_id.as_ref(),
            product.event_index_count.to_le_bytes().as_ref(),
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
pub struct CreateAssetArgs {
    name: String,
    uri: String,
}

pub fn process_create_seal(ctx: Context<CreateSeal>, args: CreateAssetArgs) -> Result<()> {

    CreateV2CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
        .asset(&ctx.accounts.asset)
        .authority(Some(&ctx.accounts.authority.to_account_info()))
        .collection(None)
        .payer(&ctx.accounts.authority)
        .owner(Some(&ctx.accounts.product.to_account_info()))
        .system_program(&ctx.accounts.system_program.to_account_info())
        .update_authority(Some(&ctx.accounts.product.to_account_info()))
        .name(args.name)
        .uri(args.uri)
        .plugins(
            vec![PluginAuthorityPair {
                authority: None,
                plugin: Plugin::FreezeDelegate(FreezeDelegate { frozen: true }),
            }]
        )
        .invoke()?;

    let product = &mut ctx.accounts.product;
    let event = &mut ctx.accounts.event;
    product.authenticated = true;

    event.product = product.key();
    event.event_index = product.event_index_count;
    event.bump = ctx.bumps.event;
    event.producer = ctx.accounts.participant.key();
    event.event_type = EventType::Authenticated;
    event.timestamp = Clock::get()?.unix_timestamp;

    //Increment the event index
    product.event_index_count += 1;

    emit!(ProductAuthenticated{
            product: ctx.accounts.product.key(),
            by: ctx.accounts.participant.key(),
            seal: ctx.accounts.asset.key(),
            timestamp: Clock::get()?.unix_timestamp
    });

    Ok(())
}

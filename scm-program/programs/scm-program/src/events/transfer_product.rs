use anchor_lang::prelude::*;

use crate::{CustodesInformation, CustodyAccepted, CustodyTransferredInitiated, EVENT_ACCOUNT, Event, EventType, PARTICIPANTS_ACCOUNT, Participant, Product, ProductDelivered, ProductState, Role, error::CustomError};

use mpl_core::{
    ID as MPL_CORE_ID,
    instructions::TransferV1CpiBuilder
};

#[derive(Accounts)]
#[instruction(address: Pubkey)]
pub struct TransferProduct<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(mut)]
    pub product: Account<'info, Product>,

    #[account(
        mut,
        seeds = [
            PARTICIPANTS_ACCOUNT.as_bytes(), 
            product.organization.as_ref(),
            address.as_ref(),
        ],
        bump = participant.bump
    )]
    pub participant: Account<'info, Participant>,

    #[account(
        mut,
        seeds = [
            PARTICIPANTS_ACCOUNT.as_bytes(), 
            product.organization.as_ref(),
            authority.key().as_ref(),
        ],
        bump = custodian.bump
    )]
    pub custodian: Account<'info, Participant>,

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

    pub system_program: Program<'info, System>,
}

pub fn process_initiate_transfer(ctx: Context<TransferProduct>, address: Pubkey) -> Result<()> {
    _ = address;
    let product = &mut ctx.accounts.product;
    let event = &mut ctx.accounts.event;

    require!(
        ctx.accounts.participant.key() != product.custodian.participant,
        CustomError::InvalidCustodianTransfer
    );

    require!(
        product.custodian.participant == ctx.accounts.custodian.key(),
        CustomError::NotCurrentCustodian
    );

    require!(
        product.state != ProductState::Delivered,
        CustomError::InvalidCustodianTransfer
    );

    require!(product.authenticated == true, CustomError::NotAuthenticated);

    product.state = ProductState::InTransit;

   product.pending_custodian = Some(ctx.accounts.participant.key());
   
   event.product = product.key();
   event.event_index = product.event_index_count;
   event.bump = ctx.bumps.event;
   event.producer = ctx.accounts.custodian.key();
   event.event_type = EventType::CustodyTransferred;
   event.destination = ctx.accounts.participant.key();
   event.timestamp = Clock::get()?.unix_timestamp;

   //Increment the event index
   product.event_index_count += 1;

    emit!(CustodyTransferredInitiated {
        product: product.key(),
        from: ctx.accounts.custodian.key(),
        to: ctx.accounts.participant.key(),
        timestamp: Clock::get()?.unix_timestamp,
    });

    Ok(())
}



#[derive(Accounts)]
pub struct AcceptProduct<'info> {
    /// CHECK: Core asset account
    #[account(mut, address = product.asset)]
    pub asset: UncheckedAccount<'info>,

    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(mut)]
    pub product: Account<'info, Product>,

       #[account(
        mut,
        seeds = [
            PARTICIPANTS_ACCOUNT.as_bytes(), 
            product.organization.as_ref(),
            product.custodian.custodian_wallet.as_ref(),
        ],
        bump = custodian.bump
    )]
    pub custodian: Account<'info, Participant>,

    #[account(
        mut,
        seeds = [
            PARTICIPANTS_ACCOUNT.as_bytes(), 
            product.organization.as_ref(),
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

pub fn process_accept_product(ctx: Context<AcceptProduct>) -> Result<()> {
    let product = &mut ctx.accounts.product;
    let old_custodian = product.custodian.custodian_wallet;
    let event = &mut ctx.accounts.event;

    match product.pending_custodian {
        Some(address) => {
            require!(address == ctx.accounts.participant.key(), CustomError::NotPendingCustodian);
        },
        None => {
            return Err(CustomError::NoPendingCustodian.into());
        }
    }

    if ctx.accounts.participant.role == Role::Retailer {
        product.state = ProductState::Delivered;
    } else {
        product.state = ProductState::Arrived;
    }

    let seeds = &[
        PARTICIPANTS_ACCOUNT.as_bytes(),
        product.organization.as_ref(),
        old_custodian.as_ref(),
        &[ctx.accounts.custodian.bump],
    ];

    let custodian_signer_seeds = [&seeds[..]];

    
     TransferV1CpiBuilder::new(
       &ctx.accounts.mpl_core_program.to_account_info(),
   )
        .asset(&ctx.accounts.asset)
        .collection(None)
        .payer(&ctx.accounts.authority)
        .authority(Some(&ctx.accounts.custodian.to_account_info()))
        .new_owner(&ctx.accounts.participant.to_account_info())
        .system_program(Some(&ctx.accounts.system_program.to_account_info()))
        .invoke_signed(&custodian_signer_seeds)?;



    product.custodian = CustodesInformation {
        participant: ctx.accounts.participant.key(),
        role: ctx.accounts.participant.role.clone(),
        custodian_wallet: ctx.accounts.participant.address,
    };

    product.pending_custodian = None;

    event.product = product.key();
    event.event_index = product.event_index_count;
    event.bump = ctx.bumps.event;
    event.producer = ctx.accounts.participant.key();
    event.event_type = EventType::CustodyReceived;
    event.timestamp = Clock::get()?.unix_timestamp;

    //Increment the event index
    product.event_index_count += 1;

    match product.state {
        ProductState::Delivered => {
            emit!(ProductDelivered{
                product: product.key(),
                from: ctx.accounts.custodian.key(),
                to: ctx.accounts.participant.key(),
                timestamp: Clock::get()?.unix_timestamp
            });
        }
        ProductState::Arrived => {
            emit!(CustodyAccepted{
                product: product.key(),
                from: ctx.accounts.custodian.key(),
                to: ctx.accounts.participant.key(),
                timestamp: Clock::get()?.unix_timestamp
            });
        }
        _ => {}
    }


    Ok(())
}
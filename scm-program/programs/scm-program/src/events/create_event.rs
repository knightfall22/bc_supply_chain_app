use anchor_lang::prelude::*;

use crate::{EVENT_ACCOUNT, Event, Organization, Participant, Product};

#[derive(Accounts)]
pub struct CreateEvent<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    pub product: Account<'info, Product>,

    pub organization: Account<'info, Organization>,

    pub participant: Account<'info, Participant>,

    #[account(
        init,
        payer = authority,
        space = 8 + Event::INIT_SPACE,
        seeds = [
            EVENT_ACCOUNT.as_bytes(),
            product.event_index_count.to_le_bytes().as_ref(),
            organization.key().as_ref()
        ],
        bump
    )]
    pub event: Account<'info, Event>,
    
    pub system_program: Program<'info, System>
}

pub fn process_create_event(ctx: Context<CreateEvent>
) -> Result<()> {
    let event = &mut ctx.accounts.event;
    event.product = ctx.accounts.product.key();
    event.bump = ctx.bumps.event;
    event.event_type = crate::EventType::Created;
    event.producer = ctx.accounts.participant.key();
    event.timestamp = Clock::get()?.unix_timestamp;
    Ok(())
}
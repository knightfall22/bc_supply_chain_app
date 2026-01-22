use anchor_lang::prelude::*;

use crate::{ORGANIZATION_ACCOUNT, Organization, PARTICIPANTS_ACCOUNT, Participant, Role};

#[derive(Accounts)]
pub struct RegisterOrganization<'info> {
    #[account(mut)]
    authority: Signer<'info>,

    #[account(
        init_if_needed, 
        payer = authority,
        space = 8 + Organization::INIT_SPACE,
        seeds = [ORGANIZATION_ACCOUNT.as_bytes(), authority.key().as_ref()],
        bump
    )]
    organization: Account<'info, Organization>,

    #[account(
        init_if_needed,
        payer = authority,
        seeds = [
            PARTICIPANTS_ACCOUNT.as_bytes(),
            organization.key().as_ref(),
            authority.key().as_ref()
        ],
        bump,
        space = 8 + Participant::INIT_SPACE
    )]
    pub participant: Account<'info, Participant>,

    pub system_program: Program<'info, System>,
}

pub fn process_register_organization(ctx: Context<RegisterOrganization>,  name: String) -> Result<()> {
    let organization = &mut ctx.accounts.organization;
    organization.name = name.clone();
    organization.authority = ctx.accounts.authority.key();
    organization.bump = ctx.bumps.organization;

    let participant = &mut ctx.accounts.participant;
    participant.organization = ctx.accounts.organization.key();
    participant.address = ctx.accounts.authority.key();
    participant.name = name;
    participant.role = Role::Manufacturer;
    participant.verified = true;
    participant.bump = ctx.bumps.participant;
    Ok(())
}
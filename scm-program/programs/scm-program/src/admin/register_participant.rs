use anchor_lang::prelude::*;

use crate::{ORGANIZATION_ACCOUNT, Organization, PARTICIPANTS_ACCOUNT, Participant, Role};

#[derive(Accounts)]
#[instruction(address: Pubkey)]
pub struct RegisterParticipant<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [ORGANIZATION_ACCOUNT.as_bytes(), authority.key().as_ref()],
        bump = organization.bump,
        has_one = authority
    )]
    pub organization: Account<'info, Organization>,

    #[account(
        init,
        payer = authority,
        seeds = [
            PARTICIPANTS_ACCOUNT.as_bytes(),
            organization.key().as_ref(),
            address.as_ref()
        ],
        bump,
        space = 8 + Participant::INIT_SPACE
    )]
    pub participant: Account<'info, Participant>,

    pub system_program: Program<'info, System>,
}


pub fn process_register_participant(
    ctx: Context<RegisterParticipant>,
    address: Pubkey,
    name: String,
    role: Role,
) -> Result<()> {
    let participant = &mut ctx.accounts.participant;

    participant.organization = ctx.accounts.organization.key();
    participant.address = address;
    participant.name = name;
    participant.role = role;
    participant.verified = true;
    participant.bump = ctx.bumps.participant;

    Ok(())
}

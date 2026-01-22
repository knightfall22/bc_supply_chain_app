use anchor_lang::prelude::*;

use crate::{ORGANIZATION_ACCOUNT, Organization, Participant, Role};

#[derive(Accounts)]
pub struct UpdateParticipant<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [ORGANIZATION_ACCOUNT.as_bytes(), authority.key().as_ref()],
        bump = organization.bump,
        has_one = authority
    )]
    pub organization: Account<'info, Organization>,

    #[account(mut)]
    pub participant: Account<'info, Participant>,
    
    pub system_program: Program<'info, System>,
}

pub fn process_toggle_participant_verification(ctx: Context<UpdateParticipant>) -> Result<()> {
    let participant = &mut ctx.accounts.participant;
    participant.verified = !participant.verified;
    Ok(())
}

pub fn process_update_participant_role(ctx: Context<UpdateParticipant>, role: Role) -> Result<()> {
    let participant = &mut ctx.accounts.participant;
    participant.role = role;
    Ok(())
}

pub fn process_update_participant_name(ctx: Context<UpdateParticipant>, name: String) -> Result<()> {
    let participant = &mut ctx.accounts.participant;
    participant.name = name;
    Ok(())
}
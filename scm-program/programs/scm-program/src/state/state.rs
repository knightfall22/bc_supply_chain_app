use anchor_lang::prelude::*;


#[account]
#[derive(InitSpace, Debug)]
pub struct Organization {
    #[max_len(20)]
   pub name: String, // The name of the organization
   pub authority: Pubkey, // The wallet address of the organization
   pub bump: u8
}

#[account]
#[derive(InitSpace, Debug)]
pub struct Product {
    pub organization: Pubkey,
    pub manufacturer: Pubkey, // The wallet address that creates the product
    pub product_id: [u8; 16], // A unique identifier for the product
    pub batch_number: [u8; 16], // A unique identifier for the batch of the product
    pub quantity: u64, // The quantity of the product
    pub created_at: i64, // The timestamp when the product was created
    pub event_index_count: u64, // The number of events associated with this product. Used to generate event PDA keys.
    pub state: ProductState,
    pub pending_custodian: Option<Pubkey>, //Address of the person who we want to transfer the product
    pub custodian: CustodesInformation, //Address of the person in currently charge of the product(Participant's Address)
    pub authenticated: bool,
    #[max_len(20)]
    pub name: String,
    pub asset: Pubkey, //Address of the product represented as an asset
    pub bump: u8
}

#[derive(InitSpace, Clone, AnchorDeserialize, AnchorSerialize, Debug)]
pub struct CustodesInformation {
    pub participant: Pubkey,
    pub role: Role,
    pub custodian_wallet: Pubkey
}

#[derive(InitSpace, Clone, AnchorDeserialize, AnchorSerialize, Debug, PartialEq)]
pub enum ProductState {
    Created,
    Arrived,
    InTransit,
    Delivered
}

#[account]
#[derive(InitSpace, Debug)]
pub struct Event {
    pub producer: Pubkey, // Participant that produced the event
    pub event_index: u64, // A unique identifier for the event
    pub timestamp: i64, // The timestamp of the event
    pub event_type: EventType,
    pub product: Pubkey, // The product associated with the event
    pub destination: Pubkey, //used only for the transfer events
    pub bump: u8
}

#[derive(InitSpace, Clone, AnchorDeserialize, AnchorSerialize, Debug)]
pub enum EventType {
    Created,
    Authenticated,
    CustodyTransferred,
    CustodyReceived,
    CheckPointScan,
    ProductDelivered
}

#[account]
#[derive(InitSpace, Debug)]
pub struct Participant {
    pub organization: Pubkey,
    #[max_len(20)]
    pub name: String, // The name of the participant
    pub address: Pubkey, // The wallet address of the participant
    pub role: Role, // The role of the participant
    pub verified: bool,
    pub bump: u8
}

#[derive(InitSpace, Clone, AnchorDeserialize, AnchorSerialize, Debug, PartialEq)]
pub enum Role {
    Manufacturer,
    Distributor,
    Retailer //final destination, once the product is in the custody of the retailer it is considered delivered
}
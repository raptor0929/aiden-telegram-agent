# Aiden NFT Minting Function

The Aiden Telegram Agent includes a function to mint NFTs from the AidenDynamicNFT contract deployed on Base Sepolia testnet.

## Overview

The `mintNFT` function allows users to mint a NFT to their wallet address. The function:

1. Analyzes the user message to determine if they want to mint an NFT
2. Connects to the Base Sepolia network using viem
3. Mints an NFT to the specified address
4. Returns the transaction hash and block confirmation

## Configuration

To use this function, you need to configure the following environment variables:

```
PRIVATE_KEY=your_private_key_here
NFT_CONTRACT_ADDRESS=contract_address_here
```

- `PRIVATE_KEY`: The private key of the wallet that will pay gas fees for minting (without the 0x prefix)
- `NFT_CONTRACT_ADDRESS`: The address of the AidenDynamicNFT contract on Base Sepolia

## Usage

The function analyzes user messages to determine if they want to mint an NFT. It looks for phrases like:

- "mint nft"
- "mint a nft"
- "mint an nft"
- "get nft"
- "want nft"
- "would like nft"

If a user message contains any of these phrases, the agent will attempt to mint an NFT to the provided address.

### Example Telegram Interaction

```
User: I would like to mint an NFT to my wallet 0x123...
Agent: I'll mint an NFT for you! Transaction processing...
Agent: Your NFT has been minted successfully! Transaction hash: 0xabc...
```

## Function Details

The `mintNFT` function accepts two parameters:

1. `userAddress`: The recipient address to mint the NFT to
2. `userRequest`: The original user message to analyze

It returns a JSON response with:

- `minted`: Boolean indicating success
- `transactionHash`: The transaction hash if minted
- `blockNumber`: The block number in which the transaction was confirmed
- `recipientAddress`: The address that received the NFT

## Error Handling

The function handles several error conditions:

- Missing user address
- User not requesting an NFT mint
- Missing environment variables
- Contract errors during minting

## Implementation

The function is implemented in `functions.ts` and uses the viem library to interact with the blockchain. It's integrated into the NFTAgent worker in `workers.ts` and registered with the Aiden agent in `aiden.ts`. 
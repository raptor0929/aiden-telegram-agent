# Aiden Dynamic NFT

A dynamic NFT contract for the Aiden Telegram Agent that can update its metadata through Pinata.

## Features

- Mint new NFTs with dynamic metadata
- Update NFT metadata and images
- Uses IPFS/Pinata for decentralized storage
- Deployed on Base Sepolia testnet

## Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation) installed
- Git
- Basic understanding of Solidity and ERC-721 tokens

## Setup

1. Clone this repository:
   ```
   git clone <repository-url>
   cd aiden-telegram-agent
   ```

2. Install dependencies:
   ```
   forge install
   forge install OpenZeppelin/openzeppelin-contracts
   ```

3. Copy the environment example file and update with your values:
   ```
   cp .env.foundry.example .env
   ```
   Edit the `.env` file with your private key and Etherscan API key.

## Compile the Contract

```
forge build
```

## Deploy to Base Sepolia

1. Make sure you have some Base Sepolia ETH in your wallet.

2. Deploy using the deployment script:
   ```
   forge script script/DeployAidenNFT.s.sol:DeployAidenNFT --rpc-url base_sepolia --broadcast --verify
   ```

## Metadata and Image

The NFT uses the following Pinata CID for the image: 
```
bafkreia5t6tmp4hcvpfdddfkah47riaf3psikugg53podokw67tcko4gvm
```

You can access this image through any IPFS gateway:
```
https://gateway.pinata.cloud/ipfs/bafkreia5t6tmp4hcvpfdddfkah47riaf3psikugg53podokw67tcko4gvm
```

## Contract Interaction

After deployment, you can interact with the contract using Foundry's `cast` command or through Etherscan on Base Sepolia.

### Mint an NFT

```
cast send <CONTRACT_ADDRESS> "mint(address)" <RECIPIENT_ADDRESS> --rpc-url base_sepolia --private-key <YOUR_PRIVATE_KEY>
```

### Update Metadata

```
cast send <CONTRACT_ADDRESS> "updateMetadata(uint256)" <TOKEN_ID> --rpc-url base_sepolia --private-key <YOUR_PRIVATE_KEY>
```

## License

This project is licensed under the MIT License. 
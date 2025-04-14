// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {AidogDynamicNFT} from "../src/AidogDynamicNFT.sol";

contract DeployAidogNFT is Script {
    function run() public returns (AidogDynamicNFT) {
        // Get private key for deployment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Initial base URI for the NFT metadata
        string memory initialBaseURI = "https://gateway.pinata.cloud/ipfs/bafkreifs5ydfwi6lqyderi6nwtsa7p54lr3ph6clcqyms3jxei33gormdu";
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy the NFT contract
        AidogDynamicNFT nft = new AidogDynamicNFT(initialBaseURI);
        
        vm.stopBroadcast();
        
        console.log("AidogDynamicNFT deployed at: ", address(nft));
        
        return nft;
    }
} 
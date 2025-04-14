// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/AgentDeployment.sol";

contract DeployAgentDeployment is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        uint256 deploymentFee = 1 * 10 ** 6; // 1 usdc

        vm.startBroadcast(deployerPrivateKey);

        AgentDeployment deployment = new AgentDeployment(
            0x036CbD53842c5426634e7929541eC2318f3dCF7e,
            deploymentFee
        );

        console.log("Contract deployed at:", address(deployment));

        vm.stopBroadcast();
    }
} 
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AgentDeployment is Ownable {
    IERC20 public token;
    uint256 public deploymentFee;
    mapping(address => bool) public hasPaid;
    
    event DeploymentFeePaid(address indexed user, uint256 amount);

    constructor(address _token, uint256 _deploymentFee) Ownable(msg.sender) {
        token = IERC20(_token);
        deploymentFee = _deploymentFee;
    }

    function payDeploymentFee() external {
        require(!hasPaid[msg.sender], "Already paid");
        require(token.transferFrom(msg.sender, address(this), deploymentFee), "Transfer failed");
        
        hasPaid[msg.sender] = true;
        emit DeploymentFeePaid(msg.sender, deploymentFee);
    }

    function setDeploymentFee(uint256 _newFee) external onlyOwner {
        deploymentFee = _newFee;
    }

    function withdrawFees() external onlyOwner {
        uint256 balance = token.balanceOf(address(this));
        require(token.transfer(owner(), balance), "Withdrawal failed");
    }

    function checkPaymentStatus(address _user) external view returns (bool) {
        return hasPaid[_user];
    }

    function updateDeploymentFee(uint256 _newFee) external onlyOwner {
        deploymentFee = _newFee;
    }
} 
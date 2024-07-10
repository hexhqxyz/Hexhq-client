// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

error FaucetAlreadyClaimed(address claimer);
error FaucetInsufficientFunds(uint256 requested, uint256 available);

contract Faucet is Ownable {
    IERC20 public token;
    uint256 public amountAllowed;
    mapping(address => bool) public hasClaimed;

    event Claimed(address indexed user, uint256 amount);

    constructor(address _token, uint256 _amountAllowed) Ownable(msg.sender) {
        token = IERC20(_token);
        amountAllowed = _amountAllowed;
    }

    function claimTokens() external {
        if (hasClaimed[msg.sender]) {
            revert FaucetAlreadyClaimed(msg.sender);
        }
        uint256 faucetBalance = token.balanceOf(address(this));

        if (faucetBalance < amountAllowed) {
            revert FaucetInsufficientFunds(amountAllowed, faucetBalance);
        }
        hasClaimed[msg.sender] = true;
        token.transfer(msg.sender, amountAllowed);
        emit Claimed(msg.sender, amountAllowed);
    }

    function setAmountAllowed(uint256 _amountAllowed) external onlyOwner {
        amountAllowed = _amountAllowed;
    }

    function withdrawTokens(uint256 _amount) external onlyOwner {
        token.transfer(msg.sender, _amount);
    }
}

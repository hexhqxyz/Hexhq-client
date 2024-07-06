// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Staking is ReentrancyGuard {
    IERC20 public s_stakingToken;
    IERC20 public s_rewardToken;

    constructor(address stakingTokenAddress, address rewardTokenAddress) {
        s_stakingToken = IERC20(stakingTokenAddress);
        s_rewardToken = IERC20(rewardTokenAddress);
    }
}

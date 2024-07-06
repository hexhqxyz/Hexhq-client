// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Staking is ReentrancyGuard {
    IERC20 public s_stakingToken;
    IERC20 public s_rewardToken;

    uint public constant REWARD_RATE = 10;
    uint private totalStakedToken;
    uint public rewardPerTokenStored;
    uint public lastUpdateTime;

    constructor(address stakingTokenAddress, address rewardTokenAddress) {
        s_stakingToken = IERC20(stakingTokenAddress);
        s_rewardToken = IERC20(rewardTokenAddress);
    }

    function rewardsPerToken() public view  returns (uint) {
        if(totalStakedToken == 0){
         return rewardPerTokenStored;
        }

        uint totalTime = block.timestamp - lastUpdateTime;
        uint totalRewards = REWARD_RATE * totalTime;

        return rewardPerTokenStored + totalRewards / totalStakedToken;
    }
}

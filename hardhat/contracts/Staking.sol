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

    mapping(address => uint) public stakedBalance;
    mapping(address => uint) public userRewardPerTokenPaid;
    mapping(address => uint) public rewards;

    constructor(address stakingTokenAddress, address rewardTokenAddress) {
        s_stakingToken = IERC20(stakingTokenAddress);
        s_rewardToken = IERC20(rewardTokenAddress);
    }

    function rewardsPerToken() public view returns (uint) {
        if (totalStakedToken == 0) {
            return rewardPerTokenStored;
        }

        uint totalTime = block.timestamp - lastUpdateTime;
        uint totalRewards = REWARD_RATE * totalTime;

        return rewardPerTokenStored + totalRewards / totalStakedToken;
    }

    function earned(address account) public view returns (uint) {
        return (
            (stakedBalance[account] *
                (rewardsPerToken() - userRewardPerTokenPaid[account]))
        );
    }

    modifier updateReward(address account) {
        rewardPerTokenStored = rewardsPerToken();
        lastUpdateTime = block.timestamp;

        rewards[account] = earned(account);
        userRewardPerTokenPaid[account] = rewardPerTokenStored;
        _;
    }
}

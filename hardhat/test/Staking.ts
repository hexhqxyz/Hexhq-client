import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("Staking Contract", function () {
  async function deployStakingFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, addr1, addr2] = await hre.ethers.getSigners();

    const initialSupply = 1000000n * 10n ** 18n; // 1,000,000 tokens with 18 decimals
    const stakeAmount = 1000n * 10n ** 18n; // 1,000 tokens with 18 decimals

    const Token = await hre.ethers.getContractFactory("StakingToken");
    const stakingToken = await Token.deploy(initialSupply);
    const rewardToken = await Token.deploy(initialSupply);

    await stakingToken.waitForDeployment();
    await rewardToken.waitForDeployment();

    const Staking = await hre.ethers.getContractFactory("Staking");
    const staking = await Staking.deploy(
      stakingToken.target,
      rewardToken.target
    );

    await staking.waitForDeployment();

    await rewardToken.approve(staking.target, initialSupply);
    // Transfer tokens to addr1 and addr2 for testing

    await stakingToken.transfer(addr1.getAddress(), stakeAmount);
    await stakingToken.transfer(addr2.getAddress(), stakeAmount);
    await rewardToken.transfer(staking.target, initialSupply);

    return {
      staking,
      stakingToken,
      rewardToken,
      owner,
      addr1,
      addr2,
      stakeAmount,
    };
  }

  describe("Deployment", function () {
    it("Should set the correct reward rate", async function () {
      const { staking } = await loadFixture(deployStakingFixture);
      expect(await staking.rewardRate()).to.equal(1e15);
    });

    it("Should have zero total staked tokens initially", async function () {
      const { staking } = await loadFixture(deployStakingFixture);
      expect(await staking.totalStaked()).to.equal(0);
    });
  });

  describe("Staking", function () {
    it("should allow users to stake tokens", async function () {
      const { staking, stakingToken, addr1, stakeAmount } = await loadFixture(deployStakingFixture);

      await stakingToken.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);

      expect(await staking.stakedBalanceOf(await addr1.getAddress())).to.equal(stakeAmount);
    });

    it("should not allow staking 0 tokens", async function () {
      const { staking, stakingToken, addr1 } = await loadFixture(deployStakingFixture);

      await stakingToken.connect(addr1).approve(staking.target, 0);
      await expect(staking.connect(addr1).stake(0)).to.be.revertedWithCustomError(staking, "AmountMustBeGreaterThanZero");
    });

    it("should update reward balances on staking", async function () {
      const { staking, stakingToken, addr1, stakeAmount } = await loadFixture(deployStakingFixture);

      await stakingToken.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);

      // Fast forward time to accumulate rewards
      await time.increase(3600);

      const earned = await staking.earned(await addr1.getAddress());
      expect(earned).to.be.gt(0);
    });
  });

});

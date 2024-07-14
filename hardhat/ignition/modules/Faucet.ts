import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const FaucetModule = buildModule("Faucet", (m) => {
  const stakingTokenAddress = m.getParameter("stakingTokenAddress");
  const amountAllowed = m.getParameter("amountAllowed");

  const faucet = m.contract("Faucet", [
    stakingTokenAddress,
    amountAllowed,
  ]);

  return { faucet };
});

export default FaucetModule;

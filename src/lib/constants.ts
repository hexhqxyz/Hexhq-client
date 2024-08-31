"use client";

export const SUPPORTED_CHAINS = [919, 84532, 11155111, 17000, 11155420];

const CHAIN_CONFIGS = {
  // Mode testnet
  919: {
    STAKING_TOKEN_CONTRACT_ADDRESS:
      "0x74df726F77387ebDA41b0b52056A862f41237C0d",
    REWARD_TOKEN_ADDRESS: "0x742Df2E9B29bA22687FC509f9356776176273DaB",
    STAKING_ADDRESS: "0xdfE84AAb2A3E9Db1b35A64Ccf05faB6bFfBb63b7",
    FAUCET_CONTRACT_ADDRESS: "0xafA061A7127C0b1929FA9068413ccF1C9335a368",
    AMM_CONTRACT_ADDRESS: "0x669C5f1a698Ab3a56A1a85b64dCFFE5fE2bB7e1F",
    SUBGRAPH:
      "https://api.goldsky.com/api/public/project_clzl0xoo7ac3f01wv28pp1xe4/subgraphs/astradefi/0.0.1/gn",
    BLOCK_EXPLORER: "https://sepolia.explorer.mode.network",
  },

  // Base testnet
  84532: {
    STAKING_TOKEN_CONTRACT_ADDRESS:
      "0x09572c39b311834047b694EC77A614822ffBb1ff",
    REWARD_TOKEN_ADDRESS: "0xc0C357bCCc6CFfeef97b792c72774b4c47B3D884",
    STAKING_ADDRESS: "0x3B61C76fAD6c88FA565Ed538524d10C25f63ee75",
    FAUCET_CONTRACT_ADDRESS: "0xBD22719907F3839EEc1f7482Af0788e26ed447F9",
    AMM_CONTRACT_ADDRESS: "0x21fb6F632054669EA240adAF0BCd6930Ba029A82",
    SUBGRAPH:
      "https://api.goldsky.com/api/public/project_clzp8prlvu9jb01vy3r2j6kvy/subgraphs/astradefi_base/0.0.2/gn",
    BLOCK_EXPLORER: "https://base-sepolia.blockscout.com",
  },

  // ETH Sepolia testnet
  11155111: {
    STAKING_TOKEN_CONTRACT_ADDRESS:
      "0x8fA88684F4233AbF617DE993bdFD3B4b0077626B",
    REWARD_TOKEN_ADDRESS: "0x4e7059F901c8D5e0636c5733559ed9a3440d2408",
    STAKING_ADDRESS: "0x5A67Fe909861a16937e84027657Cce21C1cC3a6a",
    FAUCET_CONTRACT_ADDRESS: "0x5CfC46B79Aaf7771A2Ce335f825d61F5a4EAEEbe",
    AMM_CONTRACT_ADDRESS: "0x0Db6DA5FE73Aa80c82ccbC5C805f298718B5ed34",
    SUBGRAPH:
      "https://api.studio.thegraph.com/query/83574/omnidefi/sepolia_v0.0.1",
    BLOCK_EXPLORER: "https://sepolia.etherscan.io",
  },

  // ETH holesky testnet
  17000: {
    STAKING_TOKEN_CONTRACT_ADDRESS:
      "0x09572c39b311834047b694EC77A614822ffBb1ff",
    REWARD_TOKEN_ADDRESS: "0xc0C357bCCc6CFfeef97b792c72774b4c47B3D884",
    STAKING_ADDRESS: "0x3B61C76fAD6c88FA565Ed538524d10C25f63ee75",
    FAUCET_CONTRACT_ADDRESS: "0xBD22719907F3839EEc1f7482Af0788e26ed447F9",
    AMM_CONTRACT_ADDRESS: "0x21fb6F632054669EA240adAF0BCd6930Ba029A82",
    SUBGRAPH:
      "https://api.studio.thegraph.com/query/83574/omnidefi/holesky_v0.0.1",
    BLOCK_EXPLORER: "https://holesky.etherscan.io",
  },

  // Polygon Amoy Testnet
  // 80002: {
  //   STAKING_TOKEN_CONTRACT_ADDRESS:
  //     "0x09572c39b311834047b694EC77A614822ffBb1ff",
  //   REWARD_TOKEN_ADDRESS: "0xc0C357bCCc6CFfeef97b792c72774b4c47B3D884",
  //   STAKING_ADDRESS: "0x3B61C76fAD6c88FA565Ed538524d10C25f63ee75",
  //   FAUCET_CONTRACT_ADDRESS: "0xBD22719907F3839EEc1f7482Af0788e26ed447F9",
  //   AMM_CONTRACT_ADDRESS: "0x21fb6F632054669EA240adAF0BCd6930Ba029A82",
  //   SUBGRAPH:
  //     "https://api.studio.thegraph.com/query/83574/omnidefi/polygon_amoy_v0.0.1",
  //   BLOCK_EXPLORER: "https://amoy.polygonscan.com",
  // },

  // Optimism sepolia testnet
  11155420: {
    STAKING_TOKEN_CONTRACT_ADDRESS:
      "0xBD22719907F3839EEc1f7482Af0788e26ed447F9",
    REWARD_TOKEN_ADDRESS: "0x21fb6F632054669EA240adAF0BCd6930Ba029A82",
    STAKING_ADDRESS: "0x592bCA70afd3ef10c91bE4fc5c07Dcc7f1AC890d",
    FAUCET_CONTRACT_ADDRESS: "0x17B50Cf3d0490C3290E8bBC0758C427B9Bf763e9",
    AMM_CONTRACT_ADDRESS: "0x533557766fBeC9825700A8Fbde88bf7B3A28dEBd",
    SUBGRAPH:
      "https://api.studio.thegraph.com/query/83574/omnidefi/optimism_sepolia_v0.0.1",
    BLOCK_EXPLORER: "https://sepolia-optimism.etherscan.io/",
  },
};

let currentChainId: keyof typeof CHAIN_CONFIGS = 11155111;

if (typeof window !== "undefined") {
  const storedChainId = window.localStorage.getItem("chainId");
  if (storedChainId) {
    currentChainId = parseInt(storedChainId) as keyof typeof CHAIN_CONFIGS;
  }
}

export const currentChain = currentChainId;

export const STAKING_TOKEN_CONTRACT_ADDRESS = CHAIN_CONFIGS[currentChainId].STAKING_TOKEN_CONTRACT_ADDRESS;

export const REWARD_TOKEN_ADDRESS = CHAIN_CONFIGS[currentChainId].REWARD_TOKEN_ADDRESS;

export const STAKING_ADDRESS = CHAIN_CONFIGS[currentChainId].STAKING_ADDRESS;

export const FAUCET_CONTRACT_ADDRESS = CHAIN_CONFIGS[currentChainId].FAUCET_CONTRACT_ADDRESS;

export const AMM_CONTRACT_ADDRESS = CHAIN_CONFIGS[currentChainId].AMM_CONTRACT_ADDRESS;

export const BLOCK_EXPLORER = CHAIN_CONFIGS[currentChainId].BLOCK_EXPLORER;

export const SUBGRAPH_URL = CHAIN_CONFIGS[currentChainId].SUBGRAPH;

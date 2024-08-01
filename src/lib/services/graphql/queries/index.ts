import { gql } from "@apollo/client";

export const GET_USER_ACTIVITIES = gql`
  query GetUserActivities($user: Bytes!, $first: Int!, $skip: Int!) {
    stakeds(where: { user: $user }, first: $first, skip: $skip) {
      id
      user
      amount
      blockTimestamp
      blockNumber
      transactionHash
      __typename
    }
    withdrawns(where: { user: $user }, first: $first, skip: $skip) {
      id
      user
      amount
      blockTimestamp
      blockNumber
      transactionHash
      __typename
    }
    rewardsClaimeds(where: { user: $user }, first: $first, skip: $skip) {
      id
      user
      amount
      blockTimestamp
      blockNumber
      transactionHash
      __typename
    }
  }
`;

export const GET_REWARDS_AMOUNT = gql`
  query GetUserActivities($user: Bytes!) {
    rewardsClaimeds(where: { user: $user }) {
      amount
    }
  }
`;

export const GET_VOLUME_DATA = gql`
  query {
    volumes(first: 100, orderBy: timestamp, orderDirection: desc) {
      timestamp
      volume
    }
  }
`;
export const GET_TVL_DATA = gql`
  query {
    tvls(first: 100, orderBy: timestamp, orderDirection: desc) {
      timestamp
      tvl
    }
  }
`;


export const GET_SWAP_DATA = gql`
  query($first: Int!, $skip: Int!, $address: String) {
    swappeds(first: $first, skip: $skip, where: { swapper_contains: $address }, orderBy: blockTimestamp, orderDirection: desc) {
      swapper
      tokenIn
      tokenOut
      amountIn
      amountOut
      blockTimestamp
      transactionHash
    }
  }
`;

export const GET_ADD_LIQUIDITY_DATA = gql`
  query($first: Int!, $skip: Int!, $address: String) {
    liquidityProvideds(first: $first, skip: $skip, where: { provider_contains: $address }, orderBy: blockTimestamp, orderDirection: desc) {
      provider
      amount1
      amount2
      blockTimestamp
      transactionHash
    }
  }
`;

export const GET_REMOVE_LIQUIDITY_DATA = gql`
  query($first: Int!, $skip: Int!, $address: String) {
    liquidityRemoveds(first: $first, skip: $skip, where: { provider_contains: $address }, orderBy: blockTimestamp, orderDirection: desc) {
      provider
      amount1
      amount2
      blockTimestamp
      transactionHash
    }
  }
`;


export const GET_STAKE_DATA = gql`
  query GetStakeData($first: Int!, $skip: Int!, $address: String) {
    stakeds(first: $first, skip: $skip, where: { user_contains: $address }, orderBy: blockTimestamp, orderDirection: desc) {
      user
      amount
      blockTimestamp
      transactionHash
    }
  }
`;

export const GET_UNSTAKE_DATA = gql`
  query GetUnstakeData($first: Int!, $skip: Int!, $address: String) {
    withdrawns(first: $first, skip: $skip, where: { user_contains: $address }, orderBy: blockTimestamp, orderDirection: desc) {
      user
      amount
      blockTimestamp
      transactionHash
    }
  }
`;

export const GET_CLAIM_DATA = gql`
  query GetClaimData($first: Int!, $skip: Int!, $address: String) {
    rewardsClaimeds(first: $first, skip: $skip, where: { user_contains: $address }, orderBy: blockTimestamp, orderDirection: desc) {
      user
      amount
      blockTimestamp
      transactionHash
    }
  }
`;


export const GET_LOAN_TAKEN_DATA = gql`
  query GetLoanTakenData($first: Int!, $skip: Int!, $address: String) {
    loanTakens(first: $first, skip: $skip, where: { user_contains: $address }, orderBy: blockTimestamp, orderDirection: desc) {
      user
      amount
      blockTimestamp
      transactionHash
    }
  }
`;

export const GET_LOAN_REPAID_DATA = gql`
  query GetLoanRepaidData($first: Int!, $skip: Int!, $address: String) {
    loanRepaids(first: $first, skip: $skip, where: { user_contains: $address }, orderBy: blockTimestamp, orderDirection: desc) {
      user
      amount
      blockTimestamp
      transactionHash
    }
  }
`;

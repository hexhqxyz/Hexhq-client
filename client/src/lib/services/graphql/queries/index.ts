import { gql } from '@apollo/client';

export const GET_USER_ACTIVITIES = gql`
  query GetUserActivities($user: Bytes!, $first: Int!, $skip: Int!) {
    stakeds(where: { user: $user }, first: $first, skip: $skip) {
      id
      user
      amount
      blockTimestamp
      blockNumber
      transactionHash
    }
    withdrawns(where: { user: $user }, first: $first, skip: $skip) {
      id
      user
      amount
      blockTimestamp
      blockNumber
      transactionHash
    }
    rewardsClaimeds(where: { user: $user }, first: $first, skip: $skip) {
      id
      user
      amount
      blockTimestamp
      blockNumber
      transactionHash
    }
  }
`;




export const GET_STAKED_ACTIVITIES = gql`
  query GetStakedActivities($user: Bytes!, $first: Int!, $skip: Int!) {
    stakeds(where: { user: $user }, first: $first, skip: $skip) {
      id
      user
      amount
      blockTimestamp
      blockNumber
      transactionHash
    }
  }
`;

export const GET_WITHDRAWN_ACTIVITIES = gql`
  query GetWithdrawnActivities($user: Bytes!, $first: Int!, $skip: Int!) {
    withdrawns(where: { user: $user }, first: $first, skip: $skip) {
      id
      user
      amount
      blockTimestamp
      blockNumber
      transactionHash
    }
  }
`;

export const GET_REWARDS_CLAIMED_ACTIVITIES = gql`
  query GetRewardsClaimedActivities($user: Bytes!, $first: Int!, $skip: Int!) {
    rewardsClaimeds(where: { user: $user }, first: $first, skip: $skip) {
      id
      user
      amount
      blockTimestamp
      blockNumber
      transactionHash
    }
  }
`;

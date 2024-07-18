import { gql } from '@apollo/client';

export const GET_USER_ACTIVITIES = gql`
  query GetUserActivities($user: Bytes!) {
    stakeds(where: { user: $user }) {
      id
      user
      amount
      blockTimestamp
      blockNumber
      transactionHash
    }
    withdrawns(where: { user: $user }) {
      id
      user
      amount
      blockTimestamp
      blockNumber
      transactionHash
    }
    rewardsClaimeds(where: { user: $user }) {
      id
      user
      amount
      blockTimestamp
      blockNumber
      transactionHash
    }
  }
`;

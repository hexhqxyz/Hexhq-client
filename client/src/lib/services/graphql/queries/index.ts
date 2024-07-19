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

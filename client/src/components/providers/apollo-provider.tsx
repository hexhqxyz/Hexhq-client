"use client";

import * as React from "react";
import { ApolloProvider as NextApolloProvider } from "@apollo/client";
import client from "@/lib/services/graphql/apolloClient";

type Props = {
  children: React.ReactNode;
};
export function ApolloProvider({ children }: Props) {
  return <NextApolloProvider client={client}>{children}</NextApolloProvider>;
}

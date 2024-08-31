"use client";

import { currentChain, SUBGRAPH_URL } from "@/lib/constants";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

// const BASE_SEPOLIA_GOLDSKY_URL =
//   "https://api.goldsky.com/api/public/project_clzp8prlvu9jb01vy3r2j6kvy/subgraphs/astradefi_base/0.0.2/gn";
// const MODE_SEPOLIA_GOLDSKY_URL =
//   "https://api.goldsky.com/api/public/project_clzl0xoo7ac3f01wv28pp1xe4/subgraphs/astradefi/0.0.1/gn";
let URL = SUBGRAPH_URL;
if (typeof window !== "undefined") {
  URL = SUBGRAPH_URL;
}
// currentChain === 84532
//     ? BASE_SEPOLIA_GOLDSKY_URL
//     : MODE_SEPOLIA_GOLDSKY_URL;

const client = new ApolloClient({
  link: new HttpLink({
    uri: URL,
  }),
  cache: new InMemoryCache(),
});

export default client;

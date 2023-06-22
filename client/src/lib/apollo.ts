import { ApolloClient, InMemoryCache } from "@apollo/client";

const apolloClient = new ApolloClient({
  // uri: "http://localhost:8002/graphql/api",
  uri: process.env.NEXT_PUBLIC_API_URL,
  cache: new InMemoryCache(),
});

export default apolloClient;

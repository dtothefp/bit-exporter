import {
  from,
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';

const uri = process.env.NEXT_PUBLIC_APPSYNC_API_URL || '';
const apiKey = process.env.NEXT_PUBLIC_APPSYNC_API_KEY || '';

const httpLink = new HttpLink({
  uri,
  headers: {
    'x-api-key': apiKey,
  },
});

export function initializeApollo(
  initialState: null | NormalizedCacheObject = null,
) {
  const apolloClient = new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: from([httpLink]),
    cache: new InMemoryCache(),
  });

  if (initialState) {
    apolloClient.cache.restore(initialState);
  }

  return apolloClient;
}

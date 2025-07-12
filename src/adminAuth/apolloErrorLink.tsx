import { onError } from '@apollo/client/link/error';

export const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (
        err.message.toLowerCase().includes('signature has expired') ||
        err.extensions?.code === 'UNAUTHENTICATED'
      ) {
        // Clear token and redirect
        localStorage.removeItem('authToken');
        window.location.href = '/login';
        break;
      }
    }
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

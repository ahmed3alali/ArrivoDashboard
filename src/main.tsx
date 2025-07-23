import { createRoot } from 'react-dom/client';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  ApolloLink,
  concat,
} from '@apollo/client';
import { errorLink } from './adminAuth/apolloErrorLink'; 
import { setContext } from '@apollo/client/link/context';
import App from './App';
import './index.css';
import { UserProvider } from './adminAuth/UserContext';
import { createTheme, MantineProvider } from '@mantine/core';


// Before ReactDOM.createRoot(...)
const lang = localStorage.getItem("appLanguage") || "en";
document.documentElement.lang = lang;
document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

export function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}



// HTTP connection to the API
const httpLink = createHttpLink({
  uri:
    import.meta.env.MODE === 'development'
      ? '/graphql/' // use proxy in dev
      : `${import.meta.env.VITE_BACKEND_URL}/graphql/`, // full URL in prod
});

// Middleware to add the authorization header with token from localStorage
const authMiddleware = new ApolloLink((operation, forward) => {
  const token = getCookie("authToken");

  if (token) {
    operation.setContext({
      headers: {
        Authorization: `JWT ${token}`,
      },
    });
  }

  return forward(operation);
});

// Create Apollo Client instance with authLink middleware and cache
const client = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache(),
});



const theme = createTheme({
  // Customize if you want
  primaryColor: 'blue',
});



// Create root and render the App component wrapped with ApolloProvider
const root = createRoot(document.getElementById('root')!);
root.render(
  <ApolloProvider client={client}>
     <UserProvider>
     <MantineProvider theme={theme}>
      <App />
    </MantineProvider>
    </UserProvider>
  </ApolloProvider>
);

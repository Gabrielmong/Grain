import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ApolloProvider } from '@apollo/client';
import { store, persistor } from './store/store';
import { router } from './router/router';
import { apolloClient } from './lib/apolloClient';
import { AppInitializer, ThemeWrapper } from './components';
import './i18n/config';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppInitializer />
          <ThemeWrapper>
            <RouterProvider router={router} />
          </ThemeWrapper>
        </PersistGate>
      </Provider>
    </ApolloProvider>
  </StrictMode>
);

import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ApolloProvider, useQuery } from '@apollo/client';
import { store, persistor } from './store/store';
import { router } from './router/router';
import { apolloClient } from './lib/apolloClient';
import { loadUserFromStorage } from './store/authSlice';
import { setCurrency, setLanguage, setThemeMode } from './store/settings/settingsSlice';
import { GET_SETTINGS } from './graphql/operations';
import { ThemeWrapper } from './components';
import './i18n/config';
import type { Currency, Language, ThemeMode } from './types/settings';

function AppInitializer() {
  const dispatch = useDispatch();

  // Load user from localStorage on app init
  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  // Query settings from backend on first render and apply them
  const { data } = useQuery(GET_SETTINGS, {
    skip: !store.getState().auth.isAuthenticated,
    onCompleted: (data) => {
      if (data?.settings) {
        dispatch(setCurrency(data.settings.currency as Currency));
        dispatch(setLanguage(data.settings.language as Language));
        dispatch(setThemeMode(data.settings.themeMode as ThemeMode));
      }
    },
  });

  return null;
}

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

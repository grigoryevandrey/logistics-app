import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';
import theme from './theme';
import { AddressesPage, AdminsPage, AuthPage, DeliveriesPage, DriversPage, ManagersPage, VehiclesPage } from './pages';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  ADDRESSES_PATH,
  ADMINS_PATH,
  AUTH_PATH,
  DELIVERIES_PATH,
  DRIVERS_PATH,
  MANAGERS_PATH,
  VEHICLES_PATH,
} from './configuration';
import { store } from './store';
import { PrivateRoute } from './utils';

export default function App(): JSX.Element {
  const credentialsExists =
    store.getState().global.credentials.accessToken && store.getState().global.credentials.refreshToken;
  console.log('🚀 ~ file: App.tsx ~ line 21 ~ App ~ credentialsExists', !!credentialsExists);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          backgroundColor: (theme) => theme.palette.background.default,
          display: 'flex',
          flexFlow: 'column',
          height: '100%',
        }}
      >
        <Router basename={'/'}>
          <Routes>
            <Route path={ADDRESSES_PATH} element={<PrivateRoute />}>
              <Route path={ADDRESSES_PATH} element={<AddressesPage />} />
            </Route>

            <Route path={VEHICLES_PATH} element={<PrivateRoute />}>
              <Route path={VEHICLES_PATH} element={<VehiclesPage />} />
            </Route>

            <Route path={DELIVERIES_PATH} element={<PrivateRoute />}>
              <Route path={DELIVERIES_PATH} element={<DeliveriesPage />} />
            </Route>

            <Route path={DRIVERS_PATH} element={<PrivateRoute />}>
              <Route path={DRIVERS_PATH} element={<DriversPage />} />
            </Route>

            <Route path={MANAGERS_PATH} element={<PrivateRoute />}>
              <Route path={MANAGERS_PATH} element={<ManagersPage />} />
            </Route>

            <Route path={ADMINS_PATH} element={<PrivateRoute />}>
              <Route path={ADMINS_PATH} element={<AdminsPage />} />
            </Route>

            <Route path={AUTH_PATH} element={<AuthPage />} />

            {/* TODO 404 page */}
            <Route path="*" element={credentialsExists ? <DeliveriesPage /> : <AuthPage />} />
          </Routes>
        </Router>
      </Box>
    </ThemeProvider>
  );
}

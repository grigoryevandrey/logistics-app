import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';
import theme from './theme';
import {
  AllAddressesPage,
  AdminsPage,
  AuthPage,
  DeliveriesPage,
  DriversPage,
  ManagersPage,
  VehiclesPage,
} from './pages';
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

export default function App(): JSX.Element {
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
            <Route path={ADDRESSES_PATH} element={<AllAddressesPage />} />
            <Route path={`${ADDRESSES_PATH}/:id`} element={<AllAddressesPage />} />

            <Route path={VEHICLES_PATH} element={<VehiclesPage />} />
            <Route path={DELIVERIES_PATH} element={<DeliveriesPage />} />
            <Route path={DRIVERS_PATH} element={<DriversPage />} />

            <Route path={MANAGERS_PATH} element={<ManagersPage />} />
            <Route path={ADMINS_PATH} element={<AdminsPage />} />

            <Route path={AUTH_PATH} element={<AuthPage />} />

            {/* TODO 404 page */}
            <Route path="*" element={<DeliveriesPage />} />
          </Routes>
        </Router>
      </Box>
    </ThemeProvider>
  );
}

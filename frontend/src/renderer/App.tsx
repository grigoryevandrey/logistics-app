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
            <Route path={ADDRESSES_PATH} element={<AddressesPage />} />
            <Route path={VEHICLES_PATH} element={<VehiclesPage />} />
            <Route path={DELIVERIES_PATH} element={<DeliveriesPage />} />
            <Route path={DRIVERS_PATH} element={<DriversPage />} />

            <Route path={MANAGERS_PATH} element={<ManagersPage />} />
            <Route path={ADMINS_PATH} element={<AdminsPage />} />

            <Route path={AUTH_PATH} element={<AuthPage />} />

            <Route path="*" element={<DeliveriesPage />} />
          </Routes>
        </Router>
      </Box>
    </ThemeProvider>
  );
}

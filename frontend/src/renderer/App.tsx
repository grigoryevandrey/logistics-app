import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';
import theme from './theme';
import { AddressesPage, DeliveriesPage, DriversPage, VehiclesPage } from './pages';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ADDRESSES_PATH, DELIVERIES_PATH, DRIVERS_PATH, VEHICLES_PATH } from './configuration';

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

            <Route path="*" element={<DriversPage />} />
          </Routes>
        </Router>
      </Box>
    </ThemeProvider>
  );
}

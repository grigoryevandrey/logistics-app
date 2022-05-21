import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';
import theme from './theme';
import { AddressesPage } from './pages';

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
        <AddressesPage />
      </Box>
    </ThemeProvider>
  );
}

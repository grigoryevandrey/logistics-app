import { Box, Divider } from '@mui/material';
import React, { Component } from 'react';

export class TopBar extends Component {
  public override render() {
    return (
      <>
        <Box
          sx={{
            backgroundColor: (theme) => theme.palette.background.default,
            flex: '0 1 5rem',
          }}
        >
          TopBar
        </Box>
        <Divider />
      </>
    );
  }
}

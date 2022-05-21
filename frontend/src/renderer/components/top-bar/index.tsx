import { Box, Divider } from '@mui/material';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { AUTH_PATH } from '../../configuration';

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
          <Link to={AUTH_PATH}> Выход </Link>
        </Box>
        <Divider />
      </>
    );
  }
}

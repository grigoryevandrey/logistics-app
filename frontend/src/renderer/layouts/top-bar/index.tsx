import { Box, Button, Divider, Paper } from '@mui/material';
import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { AuthClient } from '../../clients';
import { RootState } from '../../store';
import { setIsLoggingOut, resetIsLoggingOut } from '../../reducers';
import { Navigate } from 'react-router-dom';
import { AUTH_PATH } from '../../configuration';

interface TopBarProps extends PropsFromRedux {}

export class Bar extends Component<TopBarProps> {
  private readonly authClient = AuthClient;

  private async handleLogout() {
    await this.authClient.logout();
    await this.props.setIsLoggingOut();
    await this.props.resetIsLoggingOut();
  }

  public override render() {
    if (this.props.isLoggingOut) return <Navigate to={AUTH_PATH} />;

    return (
      <>
        <Paper>
          <Box
            sx={{
              backgroundColor: (theme) => theme.palette.background.default,
              flex: '0 1 5rem',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Button
              variant="text"
              sx={{
                marginLeft: 'auto',
                marginRight: 3,
              }}
              onClick={this.handleLogout.bind(this)}
            >
              Выход
            </Button>
          </Box>
          <Divider />
        </Paper>
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  const { user, isLoggingOut } = state.global;

  return { user, isLoggingOut };
};

const mapDispatchToProps = {
  setIsLoggingOut,
  resetIsLoggingOut,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export const TopBar = connector(Bar);

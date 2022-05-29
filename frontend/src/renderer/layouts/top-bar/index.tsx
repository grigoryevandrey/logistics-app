import { Box, Button, Divider } from '@mui/material';
import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from 'src/renderer/store';
// import { Link } from 'react-router-dom';
// import { AUTH_PATH } from '../../configuration';

interface TopBarProps extends PropsFromRedux {}

export class Bar extends Component<TopBarProps> {
  public override render() {
    return (
      <>
        <Box
          sx={{
            backgroundColor: (theme) => theme.palette.background.default,
            flex: '0 1 5rem',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {/* <Link to={AUTH_PATH}> Выход </Link> */}
          {this.props.user.lastName} {this.props.user.firstName}
          <Button
            variant="text"
            sx={{
              marginLeft: 'auto',
              marginRight: 3,
            }}
          >
            Выход
          </Button>
        </Box>
        <Divider />
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  const { user } = state.global;

  return { user };
};

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export const TopBar = connector(Bar);

import { Box, Button, Card, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../store';
import {
  setLoginError,
  setPasswordError,
  setLoginData,
  setPasswordData,
  setRoleData,
  resetLoginFormState,
  setUser,
  setRedirect,
  setCredentials,
} from '../../reducers';
import { LoginStrategy } from '../../enums';
import { AuthClient } from '../../clients';
import { Navigate } from 'react-router-dom';
import { DELIVERIES_PATH } from '../../configuration';

interface AuthLayoutProps extends PropsFromRedux {}

class Auth extends Component<AuthLayoutProps> {
  constructor(props: AuthLayoutProps) {
    super(props);
  }

  private async authenticate(): Promise<void> {
    const login = this.props.login.data;
    const password = this.props.password.data;

    if (!password || !login) {
      this.props.setLoginError(!login);
      this.props.setPasswordError(!password);
      return;
    }

    const credentials = { login, password };

    try {
      await AuthClient.login(credentials, this.props.role);

      await this.props.setRedirect();

      this.props.resetLoginFormState();
    } catch (e) {
      console.error(e);
    }
  }

  public override render() {
    if (this.props.redirect) {
      return <Navigate to={DELIVERIES_PATH} />;
    }

    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Card
          sx={{
            height: '40rem',
            width: '30rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              height: '25rem',
              width: '30rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <TextField
              label="Логин"
              variant="standard"
              InputProps={{
                sx: {
                  width: '20rem',
                  fontSize: '1.2rem',
                },
              }}
              InputLabelProps={{
                sx: {
                  fontSize: '1.2rem',
                },
              }}
              value={this.props.login.data}
              error={this.props.login.error}
              onChange={(e) => {
                this.props.setLoginData(e.target.value);
              }}
            />
            <TextField
              label="Пароль"
              variant="standard"
              type="password"
              InputProps={{
                sx: {
                  width: '20rem',
                  fontSize: '1.2rem',
                },
              }}
              InputLabelProps={{
                sx: {
                  fontSize: '1.2rem',
                },
              }}
              value={this.props.password.data}
              error={this.props.password.error}
              onChange={(e) => {
                this.props.setPasswordData(e.target.value);
              }}
            />
            <ToggleButtonGroup exclusive value={this.props.role}>
              <ToggleButton
                value={LoginStrategy.Manager}
                sx={{
                  width: '10rem',
                }}
                onClick={() => this.props.setRoleData(LoginStrategy.Manager)}
              >
                Manager
              </ToggleButton>
              <ToggleButton
                value={LoginStrategy.Admin}
                sx={{
                  width: '10rem',
                }}
                onClick={() => this.props.setRoleData(LoginStrategy.Admin)}
              >
                Admin
              </ToggleButton>
            </ToggleButtonGroup>
            <Button
              sx={{
                width: '20rem',
                fontSize: '1.2rem',
              }}
              variant="contained"
              onClick={() => this.authenticate()}
            >
              Войти
            </Button>
          </Box>
        </Card>
      </Box>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  const { role, login, password, redirect } = state.loginForm;

  return { role, login, password, redirect };
};

const mapDispatchToProps = {
  setLoginData,
  setPasswordData,
  setRoleData,
  setLoginError,
  setPasswordError,
  resetLoginFormState,
  setUser,
  setRedirect,
  setCredentials,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export const AuthLayout = connector(Auth);

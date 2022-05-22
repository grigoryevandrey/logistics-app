import { Box, Button, Card, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import React, { Component } from 'react';

interface AuthLayoutProps {}

export class AuthLayout extends Component<AuthLayoutProps> {
  constructor(props: AuthLayoutProps) {
    super(props);
  }

  public override render() {
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
            height: '60rem',
            width: '50rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              height: '40rem',
              width: '50rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <TextField
              label="Логин"
              variant="standard"
              InputLabelProps={{
                sx: {
                  fontSize: '2rem',
                },
              }}
              InputProps={{
                sx: {
                  width: '30rem',
                  fontSize: '2rem',
                },
              }}
            />
            <TextField
              label="Пароль"
              variant="standard"
              InputLabelProps={{
                sx: {
                  fontSize: '2rem',
                },
              }}
              InputProps={{
                sx: {
                  width: '30rem',
                  fontSize: '2rem',
                },
              }}
            />
            <ToggleButtonGroup exclusive value="manager">
              <ToggleButton
                value="manager"
                sx={{
                  width: '15rem',
                  fontSize: '1.5rem',
                }}
              >
                Менеджер
              </ToggleButton>
              <ToggleButton
                value="admin"
                sx={{
                  width: '15rem',
                  fontSize: '1.5rem',
                }}
              >
                Админ
              </ToggleButton>
            </ToggleButtonGroup>
            <Button
              sx={{
                width: '30rem',
                fontSize: '2rem',
              }}
              variant="contained"
            >
              Войти
            </Button>
          </Box>
        </Card>
      </Box>
    );
  }
}

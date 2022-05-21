import { Box } from '@mui/material';
import React, { Component } from 'react';
import { DELIVERIES_PATH } from '../../configuration';
import { Link } from 'react-router-dom';

interface AuthPageProps {}

export class AuthPage extends Component<AuthPageProps> {
  constructor(props: AuthPageProps) {
    super(props);
  }

  public override render() {
    return (
      <Box>
        <Link to={DELIVERIES_PATH}> Вход </Link>
      </Box>
    );
  }
}

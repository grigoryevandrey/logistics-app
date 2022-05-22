import React, { Component } from 'react';
import { AuthLayout } from '../../layouts';

interface AuthPageProps {}

export class AuthPage extends Component<AuthPageProps> {
  constructor(props: AuthPageProps) {
    super(props);
  }

  public override render() {
    return <AuthLayout />;
  }
}

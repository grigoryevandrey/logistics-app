import React, { Component } from 'react';
import { Dashboard } from '../../layouts';

interface AdminsPageProps {}

export class AdminsPage extends Component<AdminsPageProps> {
  constructor(props: AdminsPageProps) {
    super(props);
  }

  public override render() {
    return <Dashboard content={'Admins'} />;
  }
}

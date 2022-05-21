import React, { Component } from 'react';
import { Dashboard } from '../../layouts';

interface ManagersPageProps {}

export class ManagersPage extends Component<ManagersPageProps> {
  constructor(props: ManagersPageProps) {
    super(props);
  }

  public override render() {
    return <Dashboard content={'Managers'} />;
  }
}

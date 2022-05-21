import React, { Component } from 'react';
import { Dashboard } from '../../layouts';

interface DeliveriesPageProps {}

export class DeliveriesPage extends Component<DeliveriesPageProps> {
  constructor(props: DeliveriesPageProps) {
    super(props);
  }

  public override render() {
    return <Dashboard content={'Deliveries'} />;
  }
}

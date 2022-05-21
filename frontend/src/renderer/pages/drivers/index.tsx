import React, { Component } from 'react';
import { Dashboard } from '../../layouts';

interface DriversPageProps {}

export class DriversPage extends Component {
  constructor(props: DriversPageProps) {
    super(props);
  }

  public override render() {
    return <Dashboard content={'Drivers'} />;
  }
}

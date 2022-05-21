import React, { Component } from 'react';
import { Dashboard } from '../../layouts';

interface VehiclesPageProps {}

export class VehiclesPage extends Component<VehiclesPageProps> {
  constructor(props: VehiclesPageProps) {
    super(props);
  }

  public override render() {
    return <Dashboard content={'Vehicles'} />;
  }
}

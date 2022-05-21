import React, { Component } from 'react';
import { Dashboard } from '../../layouts';

interface AddressesPageProps {}

export class AddressesPage extends Component<AddressesPageProps> {
  constructor(props: AddressesPageProps) {
    super(props);
  }

  public override render() {
    return <Dashboard content={'Addresses'} />;
  }
}

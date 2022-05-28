import React, { Component } from 'react';
import { Dashboard } from '../../layouts';
import { AddressesClient } from '../../clients';
import {
  resetAddressesData,
  setAddressesData,
  setAddressesOffset,
  setAddressesLimit,
  setAddressesSort,
} from '../../reducers';
import { RootState } from '../../store';
import { connect, ConnectedProps } from 'react-redux';
import { Box } from '@mui/system';
import { RepresentationalTable } from '../../components';

interface AddressesPageProps extends PropsFromRedux {}

const addressesTableHeaders = [
  { label: 'Адрес', key: 'address' },
  { label: 'ID', key: 'id' },
  // { label: 'Широта', key: 'latitude' },
  // { label: 'Долгота', key: 'longitude' },
];

export class Addresses extends Component<AddressesPageProps> {
  constructor(props: AddressesPageProps) {
    super(props);
  }

  private readonly client = AddressesClient;

  public override async componentDidMount() {
    await this.fetchTableData();
  }

  private async fetchTableData(): Promise<void> {
    const data = await this.client.getAll(
      this.props.addressesOffset,
      this.props.addressesLimit,
      this.props.addressesSort,
    );

    await this.props.setAddressesData(data);
  }

  private get component(): JSX.Element {
    return (
      <Box>
        <RepresentationalTable
          offset={this.props.addressesOffset}
          limit={this.props.addressesLimit}
          sort={this.props.addressesSort}
          setOffset={this.props.setAddressesOffset}
          setLimit={this.props.setAddressesLimit}
          setSort={this.props.setAddressesSort}
          page={this.props.addressesPage}
          headerCells={addressesTableHeaders}
          rows={(this.props.addressesTableData.addresses as any) || []}
          totalElements={this.props.addressesTableData.totalRows || 0}
          fetchTableData={this.fetchTableData.bind(this)}
        ></RepresentationalTable>
      </Box>
    );
  }

  public override render() {
    return <Dashboard content={this.component} />;
  }
}

const mapStateToProps = (state: RootState) => {
  const { addressesTableData, addressesOffset, addressesLimit, addressesSort, addressesPage } = state.addresses;

  return { addressesTableData, addressesOffset, addressesLimit, addressesSort, addressesPage };
};

const mapDispatchToProps = {
  setAddressesData,
  resetAddressesData,
  setAddressesOffset,
  setAddressesLimit,
  setAddressesSort,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export const AllAddressesPage = connector(Addresses);

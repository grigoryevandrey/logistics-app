import React, { Component } from 'react';
import { Dashboard } from '../../layouts';
import { AddressesClient } from '../../clients';
import {
  resetAddressesData,
  setAddressesData,
  setAddressesOffset,
  setAddressesLimit,
  setAddressesSort,
  setRedirectToId,
  startCreatingNewElement,
} from '../../reducers';
import { RootState } from '../../store';
import { connect, ConnectedProps } from 'react-redux';
import { Box } from '@mui/system';
import { RepresentationalTable } from '../../components';
import { AddressesSort } from '../../enums';
import { SingleAddressPage } from './single';
import { Button } from '@mui/material';

interface AddressesPageProps extends PropsFromRedux {}

const addressesTableHeaders = [
  {
    label: 'Адрес',
    key: 'address',
    isSortable: true,
    ascSortString: AddressesSort.address_asc,
    descSortString: AddressesSort.address_desc,
  },
  { label: 'ID', key: 'id', isSortable: false },
];

class Addresses extends Component<AddressesPageProps> {
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

  private async openAddress(id: number): Promise<void> {
    await this.props.setRedirectToId(id);
  }

  private get component(): JSX.Element {
    if (this.props.redirectToId || this.props.isCreatingNewElement) return <SingleAddressPage />;

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
          onClick={this.openAddress.bind(this)}
        ></RepresentationalTable>
        <Button
          sx={{ margin: 2, height: '50px', width: '300px' }}
          onClick={() => this.props.startCreatingNewElement()}
          variant="contained"
        >
          Создать
        </Button>
      </Box>
    );
  }

  public override render() {
    return <Dashboard content={this.component} />;
  }
}

const mapStateToProps = (state: RootState) => {
  const {
    addressesTableData,
    addressesOffset,
    addressesLimit,
    addressesSort,
    addressesPage,
    redirectToId,
    isCreatingNewElement,
  } = state.addresses;

  return {
    addressesTableData,
    addressesOffset,
    addressesLimit,
    addressesSort,
    addressesPage,
    redirectToId,
    isCreatingNewElement,
  };
};

const mapDispatchToProps = {
  setAddressesData,
  resetAddressesData,
  setAddressesOffset,
  setAddressesLimit,
  setAddressesSort,
  setRedirectToId,
  startCreatingNewElement,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export const AddressesPage = connector(Addresses);

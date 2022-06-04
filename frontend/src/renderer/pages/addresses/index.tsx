import React, { Component } from 'react';
import { Dashboard } from '../../layouts';
import { AddressesClient } from '../../clients';
import {
  resetAddressesData,
  setAddressesData,
  setAddressesOffset,
  setAddressesLimit,
  setAddressesSort,
  setRedirectToAddressId,
  startCreatingNewAddress,
  setSingleAddressData,
  clearSingleAddressData,
  resetRedirectToAddressId,
  endCreatingNewAddress,
} from '../../reducers';
import { RootState } from '../../store';
import { connect, ConnectedProps } from 'react-redux';
import { Box } from '@mui/system';
import { RepresentationalTable } from '../../components';
import { AddressesSort, EditableElementType } from '../../enums';
import { EditablePage } from '../../components';
import { Button } from '@mui/material';

interface AddressesPageProps extends PropsFromRedux {}

const addressesTableHeaders = [
  {
    label: 'Адрес',
    key: 'address',
    isSortable: true,
    ascSortString: AddressesSort.AddressAsc,
    descSortString: AddressesSort.AddressDesc,
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
      this.props.addressesLimit,
      this.props.addressesOffset,
      this.props.addressesSort,
    );

    await this.props.setAddressesData(data);
  }

  private async openAddress(id: number): Promise<void> {
    await this.props.setRedirectToAddressId(id);
  }

  private get component(): JSX.Element {
    if (this.props.redirectToId || this.props.isCreatingNewElement)
      return (
        <EditablePage
          fetchTableData={this.fetchTableData.bind(this)}
          elements={[
            {
              type: EditableElementType.Input,
              label: 'Адрес',
              stateKey: 'address',
            },
            {
              type: EditableElementType.Input,
              label: 'Широта',
              stateKey: 'latitude',
            },
            {
              type: EditableElementType.Input,
              label: 'Долгота',
              stateKey: 'longitude',
            },
          ]}
          isCreatingNewElement={this.props.isCreatingNewElement}
          client={AddressesClient}
          endCreatingNewElement={this.props.endCreatingNewAddress}
          currentId={this.props.redirectToId}
          resetCurrentId={this.props.resetRedirectToAddressId}
          stateData={this.props.singleAddressData}
          setStateData={this.props.setSingleAddressData}
          clearStateData={this.props.clearSingleAddressData}
        />
      );

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
          onClick={() => this.props.startCreatingNewAddress()}
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
    singleAddressData,
  } = state.addresses;

  return {
    addressesTableData,
    addressesOffset,
    addressesLimit,
    addressesSort,
    addressesPage,
    redirectToId,
    isCreatingNewElement,
    singleAddressData,
  };
};

const mapDispatchToProps = {
  setAddressesData,
  resetAddressesData,
  setAddressesOffset,
  setAddressesLimit,
  setAddressesSort,
  setRedirectToAddressId,
  startCreatingNewAddress,
  setSingleAddressData,
  clearSingleAddressData,
  resetRedirectToAddressId,
  endCreatingNewAddress,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export const AddressesPage = connector(Addresses);

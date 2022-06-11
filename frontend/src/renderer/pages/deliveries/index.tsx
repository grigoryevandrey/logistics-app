import React, { Component } from 'react';
import { Dashboard } from '../../layouts';
import { AddressesClient, DeliveriesClient, DriversClient, ManagersClient, VehiclesClient } from '../../clients';
import {
  resetDeliveriesData,
  setDeliveriesData,
  setDeliveriesOffset,
  setDeliveriesLimit,
  setDeliveriesSort,
  setRedirectToDeliveryId,
  startCreatingNewDelivery,
  setSingleDeliveryData,
  clearSingleDeliveryData,
  resetRedirectToDeliveryId,
  endCreatingNewDelivery,
  setDeliveriesVehicles,
  setDeliveriesDrivers,
  setDeliveriesManagers,
  clearDeliveriesSubData,
  setDeliveriesAddressesTo,
  setDeliveriesAddressesFrom,
} from '../../reducers';
import { RootState } from '../../store';
import { connect, ConnectedProps } from 'react-redux';
import { Box } from '@mui/system';
import { RepresentationalTable, EditablePage } from '../../components';
import { DeliveriesSort, DeliveryStatus, EditableElementType } from '../../enums';
import { Button } from '@mui/material';

interface DeliveriesPageProps extends PropsFromRedux {}

const deliveriesTableHeaders = [
  {
    label: 'Содержимое',
    key: 'contents',
    isSortable: false,
  },
  {
    label: 'Статус',
    key: 'status',
    valueFromFunction: (key: DeliveryStatus) => {
      const dictionary = {
        [DeliveryStatus.NotStarted]: 'Не начат',
        [DeliveryStatus.OnTheWay]: 'В пути',
        [DeliveryStatus.Delivered]: 'Доставлен',
        [DeliveryStatus.Cancelled]: 'Отменен',
      };

      return dictionary[key];
    },
    isSortable: false,
  },
  {
    label: 'Из',
    key: 'addressFrom',
    isSortable: true,
    ascSortString: DeliveriesSort.AddressAsc,
    descSortString: DeliveriesSort.AddressDesc,
  },
  {
    label: 'В',
    key: 'addressTo',
    isSortable: true,
    ascSortString: DeliveriesSort.AddressAsc,
    descSortString: DeliveriesSort.AddressDesc,
  },
  {
    label: 'Транспорт',
    key: ['vehicle', 'vehicleCarNumber'],
    isSortable: false,
  },
  {
    label: 'Водитель',
    key: ['driverLastName', 'driverFirstName'],
    isSortable: true,
    ascSortString: DeliveriesSort.DriverAsc,
    descSortString: DeliveriesSort.DriverDesc,
  },
  {
    label: 'Менеджер',
    key: ['managerLastName', 'managerFirstName'],
    isSortable: true,
    ascSortString: DeliveriesSort.ManagerAsc,
    descSortString: DeliveriesSort.ManagerDesc,
  },
  {
    label: 'Время прибытия',
    key: 'eta',
    isSortable: true,
    ascSortString: DeliveriesSort.EtaAsc,
    descSortString: DeliveriesSort.EtaDesc,
    valueFromFunction: (key: string) => {
      const date = new Date(key);

      const day = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
      const time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

      return `${day} в ${time}`;
    },
  },
  { label: 'ID', key: 'id', isSortable: false },
];

class Deliveries extends Component<DeliveriesPageProps> {
  constructor(props: DeliveriesPageProps) {
    super(props);
  }

  private readonly client = DeliveriesClient;

  public override async componentDidMount() {
    await this.fetchTableData();
  }

  private async fetchTableData(): Promise<void> {
    const data = await this.client.getAll(
      this.props.deliveriesLimit,
      this.props.deliveriesOffset,
      this.props.deliveriesSort,
    );

    await this.props.setDeliveriesData(data);
  }

  private async openDelivery(id: number): Promise<void> {
    await this.props.setRedirectToDeliveryId(id);
  }

  private get component(): JSX.Element {
    if (this.props.redirectToDeliveryId || this.props.isCreatingNewDelivery)
      return (
        <EditablePage
          fetchTableData={this.fetchTableData.bind(this)}
          elements={[
            {
              type: EditableElementType.Input,
              label: 'Содержимое',
              stateKey: 'contents',
            },
            {
              type: EditableElementType.Selectable,
              label: 'Статус',
              stateKey: 'status',
              options: [
                {
                  value: DeliveryStatus.NotStarted,
                  text: 'Не начат',
                },
                {
                  value: DeliveryStatus.OnTheWay,
                  text: 'В пути',
                },
                {
                  value: DeliveryStatus.Delivered,
                  text: 'Доставлен',
                },
                {
                  value: DeliveryStatus.Cancelled,
                  text: 'Отменен',
                },
              ],
            },
            {
              type: EditableElementType.Autocomplete,
              label: 'Из адреса',
              stateKey: 'addressFrom',
              dataGetter: () => AddressesClient.getAll(50, 0),
              getterKey: 'addresses',
              state: this.props.deliveriesAddressesFrom,
              stateSetter: this.props.setDeliveriesAddressesFrom,
              keyOrder: ['address'],
            },
            {
              type: EditableElementType.Autocomplete,
              label: 'В адрес',
              stateKey: 'addressTo',
              dataGetter: () => AddressesClient.getAll(50, 0),
              getterKey: 'addresses',
              state: this.props.deliveriesAddressesTo,
              stateSetter: this.props.setDeliveriesAddressesTo,
              keyOrder: ['address'],
            },
            {
              type: EditableElementType.Autocomplete,
              label: 'Транспорт',
              stateKey: 'vehicleId',
              dataGetter: () => VehiclesClient.getAll(50, 0),
              getterKey: 'vehicles',
              state: this.props.deliveriesVehicles,
              stateSetter: this.props.setDeliveriesVehicles,
              keyOrder: ['vehicle', 'carNumber'],
            },
            {
              type: EditableElementType.Autocomplete,
              label: 'Водитель',
              stateKey: 'driverId',
              dataGetter: () => DriversClient.getAll(50, 0),
              getterKey: 'drivers',
              state: this.props.deliveriesDrivers,
              stateSetter: this.props.setDeliveriesDrivers,
              keyOrder: ['lastName', 'firstName', 'patronymic'],
            },
            {
              type: EditableElementType.Autocomplete,
              label: 'Менеджер',
              stateKey: 'managerId',
              dataGetter: () => ManagersClient.getAll(50, 0),
              getterKey: 'managers',
              state: this.props.deliveriesManagers,
              stateSetter: this.props.setDeliveriesManagers,
              keyOrder: ['lastName', 'firstName', 'patronymic'],
            },
            {
              type: EditableElementType.Date,
              label: 'Время прибытия',
              stateKey: 'eta',
            },
          ]}
          isCreatingNewElement={this.props.isCreatingNewDelivery}
          client={DeliveriesClient}
          endCreatingNewElement={this.props.endCreatingNewDelivery}
          currentId={this.props.redirectToDeliveryId}
          resetCurrentId={this.props.resetRedirectToDeliveryId}
          stateData={this.props.singleDeliveryData}
          setStateData={this.props.setSingleDeliveryData}
          clearStateData={this.props.clearSingleDeliveryData}
          clearRelatedData={this.props.clearDeliveriesSubData}
        />
      );

    return (
      <Box>
        <RepresentationalTable
          offset={this.props.deliveriesOffset}
          limit={this.props.deliveriesLimit}
          sort={this.props.deliveriesSort}
          setOffset={this.props.setDeliveriesOffset}
          setLimit={this.props.setDeliveriesLimit}
          setSort={this.props.setDeliveriesSort}
          page={this.props.deliveriesPage}
          headerCells={deliveriesTableHeaders}
          rows={(this.props.deliveriesTableData.deliveries as any) || []}
          totalElements={this.props.deliveriesTableData.totalRows || 0}
          fetchTableData={this.fetchTableData.bind(this)}
          onClick={this.openDelivery.bind(this)}
        ></RepresentationalTable>
        <Button
          sx={{ margin: 2, height: '50px', width: '300px' }}
          onClick={() => this.props.startCreatingNewDelivery()}
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
    deliveriesTableData,
    deliveriesOffset,
    deliveriesLimit,
    deliveriesSort,
    deliveriesPage,
    redirectToDeliveryId,
    isCreatingNewDelivery,
    singleDeliveryData,
    deliveriesAddressesFrom,
    deliveriesAddressesTo,
    deliveriesVehicles,
    deliveriesDrivers,
    deliveriesManagers,
  } = state.deliveries;

  return {
    deliveriesTableData,
    deliveriesOffset,
    deliveriesLimit,
    deliveriesSort,
    deliveriesPage,
    redirectToDeliveryId,
    isCreatingNewDelivery,
    singleDeliveryData,
    deliveriesAddressesFrom,
    deliveriesAddressesTo,
    deliveriesVehicles,
    deliveriesDrivers,
    deliveriesManagers,
  };
};

const mapDispatchToProps = {
  setDeliveriesData,
  resetDeliveriesData,
  setDeliveriesOffset,
  setDeliveriesLimit,
  setDeliveriesSort,
  setRedirectToDeliveryId,
  startCreatingNewDelivery,
  setSingleDeliveryData,
  clearSingleDeliveryData,
  resetRedirectToDeliveryId,
  endCreatingNewDelivery,
  setDeliveriesAddressesFrom,
  setDeliveriesAddressesTo,
  setDeliveriesVehicles,
  setDeliveriesDrivers,
  setDeliveriesManagers,
  clearDeliveriesSubData,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export const DeliveriesPage = connector(Deliveries);

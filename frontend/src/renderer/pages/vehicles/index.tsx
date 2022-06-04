import React, { Component } from 'react';
import { Dashboard } from '../../layouts';
import { VehiclesClient } from '../../clients';
import {
  resetVehiclesData,
  setVehiclesData,
  setVehiclesOffset,
  setVehiclesLimit,
  setVehiclesSort,
  setRedirectToVehicleId,
  startCreatingNewVehicle,
  setSingleVehicleData,
  clearSingleVehicleData,
  resetRedirectToVehicleId,
  endCreatingNewVehicle,
} from '../../reducers';
import { RootState } from '../../store';
import { connect, ConnectedProps } from 'react-redux';
import { Box } from '@mui/system';
import { VehiclesSort, EditableElementType } from '../../enums';
import { EditablePage, RepresentationalTable } from '../../components';
import { Button } from '@mui/material';

interface VehiclesPageProps extends PropsFromRedux {}

const vehiclesTableHeaders = [
  {
    label: 'Транспорт',
    key: 'vehicle',
    isSortable: true,
    ascSortString: VehiclesSort.VehicleAsc,
    descSortString: VehiclesSort.VehicleDesc,
  },
  {
    label: 'Номер',
    key: 'carNumber',
    isSortable: false,
  },
  {
    label: 'Тоннаж',
    key: 'tonnage',
    isSortable: true,
    ascSortString: VehiclesSort.TonnageAsc,
    descSortString: VehiclesSort.TonnageDesc,
  },
  { label: 'ID', key: 'id', isSortable: false },
];

class Vehicles extends Component<VehiclesPageProps> {
  constructor(props: VehiclesPageProps) {
    super(props);
  }

  private readonly client = VehiclesClient;

  public override async componentDidMount() {
    await this.fetchTableData();
  }

  private async fetchTableData(): Promise<void> {
    const data = await this.client.getAll(this.props.vehiclesLimit, this.props.vehiclesOffset, this.props.vehiclesSort);

    await this.props.setVehiclesData(data);
  }

  private async openVehicle(id: number): Promise<void> {
    await this.props.setRedirectToVehicleId(id);
  }

  private get component(): JSX.Element {
    if (this.props.redirectToVehicleId || this.props.isCreatingNewVehicle)
      return (
        <EditablePage
          fetchTableData={this.fetchTableData.bind(this)}
          elements={[
            {
              type: EditableElementType.Input,
              label: 'Наименование транспорта',
              stateKey: 'vehicle',
            },
            {
              type: EditableElementType.Input,
              label: 'Номер',
              stateKey: 'carNumber',
            },
            {
              type: EditableElementType.Input,
              label: 'Тоннаж',
              stateKey: 'tonnage',
            },
          ]}
          isCreatingNewElement={this.props.isCreatingNewVehicle}
          client={VehiclesClient}
          endCreatingNewElement={this.props.endCreatingNewVehicle}
          currentId={this.props.redirectToVehicleId}
          resetCurrentId={this.props.resetRedirectToVehicleId}
          stateData={this.props.singleVehicleData}
          setStateData={this.props.setSingleVehicleData}
          clearStateData={this.props.clearSingleVehicleData}
        />
      );

    return (
      <Box>
        <RepresentationalTable
          offset={this.props.vehiclesOffset}
          limit={this.props.vehiclesLimit}
          sort={this.props.vehiclesSort}
          setOffset={this.props.setVehiclesOffset}
          setLimit={this.props.setVehiclesLimit}
          setSort={this.props.setVehiclesSort}
          page={this.props.vehiclesPage}
          headerCells={vehiclesTableHeaders}
          rows={(this.props.vehiclesTableData.vehicles as any) || []}
          totalElements={this.props.vehiclesTableData.totalRows || 0}
          fetchTableData={this.fetchTableData.bind(this)}
          onClick={this.openVehicle.bind(this)}
        ></RepresentationalTable>
        <Button
          sx={{ margin: 2, height: '50px', width: '300px' }}
          onClick={() => this.props.startCreatingNewVehicle()}
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
    vehiclesTableData,
    vehiclesOffset,
    vehiclesLimit,
    vehiclesSort,
    vehiclesPage,
    redirectToVehicleId,
    isCreatingNewVehicle,
    singleVehicleData,
  } = state.vehicles;

  return {
    vehiclesTableData,
    vehiclesOffset,
    vehiclesLimit,
    vehiclesSort,
    vehiclesPage,
    redirectToVehicleId,
    isCreatingNewVehicle,
    singleVehicleData,
  };
};

const mapDispatchToProps = {
  setVehiclesData,
  resetVehiclesData,
  setVehiclesOffset,
  setVehiclesLimit,
  setVehiclesSort,
  setRedirectToVehicleId,
  startCreatingNewVehicle,
  setSingleVehicleData,
  clearSingleVehicleData,
  resetRedirectToVehicleId,
  endCreatingNewVehicle,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export const VehiclesPage = connector(Vehicles);

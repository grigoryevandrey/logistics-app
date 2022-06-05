import React, { Component } from 'react';
import { Dashboard } from '../../layouts';
import { DriversClient } from '../../clients';
import {
  resetDriversData,
  setDriversData,
  setDriversOffset,
  setDriversLimit,
  setDriversSort,
  setRedirectToDriverId,
  startCreatingNewDriver,
  setSingleDriverData,
  clearSingleDriverData,
  resetRedirectToDriverId,
  endCreatingNewDriver,
} from '../../reducers';
import { RootState } from '../../store';
import { connect, ConnectedProps } from 'react-redux';
import { Box } from '@mui/system';
import { RepresentationalTable, EditablePage } from '../../components';
import { DriversSort, EditableElementType } from '../../enums';
import { Button } from '@mui/material';

interface DriversPageProps extends PropsFromRedux {}

const driversTableHeaders = [
  {
    label: 'Имя',
    key: ['lastName', 'firstName', 'patronymic'],
    isSortable: true,
    ascSortString: DriversSort.NameAsc,
    descSortString: DriversSort.NameDesc,
  },
  { label: 'ID', key: 'id', isSortable: false },
];

class Drivers extends Component<DriversPageProps> {
  constructor(props: DriversPageProps) {
    super(props);
  }

  private readonly client = DriversClient;

  public override async componentDidMount() {
    await this.fetchTableData();
  }

  private async fetchTableData(): Promise<void> {
    const data = await this.client.getAll(this.props.driversLimit, this.props.driversOffset, this.props.driversSort);

    await this.props.setDriversData(data);
  }

  private async openDriver(id: number): Promise<void> {
    await this.props.setRedirectToDriverId(id);
  }

  private get component(): JSX.Element {
    if (this.props.redirectToDriverId || this.props.isCreatingNewDriver)
      return (
        <EditablePage
          fetchTableData={this.fetchTableData.bind(this)}
          elements={[
            {
              type: EditableElementType.Input,
              label: 'Фамилия',
              stateKey: 'lastName',
            },
            {
              type: EditableElementType.Input,
              label: 'Имя',
              stateKey: 'firstName',
            },
            {
              type: EditableElementType.Input,
              label: 'Отчество',
              stateKey: 'patronymic',
            },
          ]}
          isCreatingNewElement={this.props.isCreatingNewDriver}
          client={DriversClient}
          endCreatingNewElement={this.props.endCreatingNewDriver}
          currentId={this.props.redirectToDriverId}
          resetCurrentId={this.props.resetRedirectToDriverId}
          stateData={this.props.singleDriverData}
          setStateData={this.props.setSingleDriverData}
          clearStateData={this.props.clearSingleDriverData}
        />
      );

    return (
      <Box>
        <RepresentationalTable
          offset={this.props.driversOffset}
          limit={this.props.driversLimit}
          sort={this.props.driversSort}
          setOffset={this.props.setDriversOffset}
          setLimit={this.props.setDriversLimit}
          setSort={this.props.setDriversSort}
          page={this.props.driversPage}
          headerCells={driversTableHeaders}
          rows={(this.props.driversTableData.drivers as any) || []}
          totalElements={this.props.driversTableData.totalRows || 0}
          fetchTableData={this.fetchTableData.bind(this)}
          onClick={this.openDriver.bind(this)}
        ></RepresentationalTable>
        <Button
          sx={{ margin: 2, height: '50px', width: '300px' }}
          onClick={() => this.props.startCreatingNewDriver()}
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
    driversTableData,
    driversOffset,
    driversLimit,
    driversSort,
    driversPage,
    redirectToDriverId,
    isCreatingNewDriver,
    singleDriverData,
  } = state.drivers;

  return {
    driversTableData,
    driversOffset,
    driversLimit,
    driversSort,
    driversPage,
    redirectToDriverId,
    isCreatingNewDriver,
    singleDriverData,
  };
};

const mapDispatchToProps = {
  setDriversData,
  resetDriversData,
  setDriversOffset,
  setDriversLimit,
  setDriversSort,
  setRedirectToDriverId,
  startCreatingNewDriver,
  setSingleDriverData,
  clearSingleDriverData,
  resetRedirectToDriverId,
  endCreatingNewDriver,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export const DriversPage = connector(Drivers);

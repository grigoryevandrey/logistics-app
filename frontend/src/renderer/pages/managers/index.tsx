import React, { Component } from 'react';
import { Dashboard } from '../../layouts';
import { ManagersClient } from '../../clients';
import {
  resetManagersData,
  setManagersData,
  setManagersOffset,
  setManagersLimit,
  setManagersSort,
  setRedirectToManagerId,
  startCreatingNewManager,
  setSingleManagerData,
  clearSingleManagerData,
  resetRedirectToManagerId,
  endCreatingNewManager,
} from '../../reducers';
import { RootState } from '../../store';
import { connect, ConnectedProps } from 'react-redux';
import { Box } from '@mui/system';
import { RepresentationalTable, EditablePage } from '../../components';
import { ManagersSort, EditableElementType } from '../../enums';
import { Button } from '@mui/material';

interface ManagersPageProps extends PropsFromRedux {}

const managersTableHeaders = [
  {
    label: 'Имя',
    key: ['lastName', 'firstName', 'patronymic'],
    isSortable: true,
    ascSortString: ManagersSort.NameAsc,
    descSortString: ManagersSort.NameDesc,
  },
  {
    label: 'Логин',
    key: 'login',
    isSortable: true,
    ascSortString: ManagersSort.LoginAsc,
    descSortString: ManagersSort.LoginDesc,
  },
  { label: 'ID', key: 'id', isSortable: false },
];

class Managers extends Component<ManagersPageProps> {
  constructor(props: ManagersPageProps) {
    super(props);
  }

  private readonly client = ManagersClient;

  public override async componentDidMount() {
    await this.fetchTableData();
  }

  private async fetchTableData(): Promise<void> {
    const data = await this.client.getAll(this.props.managersLimit, this.props.managersOffset, this.props.managersSort);

    await this.props.setManagersData(data);
  }

  private async openManager(id: number): Promise<void> {
    await this.props.setRedirectToManagerId(id);
  }

  private get component(): JSX.Element {
    if (this.props.redirectToManagerId || this.props.isCreatingNewManager)
      return (
        <EditablePage
          fetchTableData={this.fetchTableData.bind(this)}
          elements={[
            {
              type: EditableElementType.Input,
              label: 'Логин',
              stateKey: 'login',
            },
            {
              type: EditableElementType.Input,
              label: 'Пароль',
              stateKey: 'password',
            },
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
          isCreatingNewElement={this.props.isCreatingNewManager}
          client={ManagersClient}
          endCreatingNewElement={this.props.endCreatingNewManager}
          currentId={this.props.redirectToManagerId}
          resetCurrentId={this.props.resetRedirectToManagerId}
          stateData={this.props.singleManagerData}
          setStateData={this.props.setSingleManagerData}
          clearStateData={this.props.clearSingleManagerData}
        />
      );

    return (
      <Box>
        <RepresentationalTable
          offset={this.props.managersOffset}
          limit={this.props.managersLimit}
          sort={this.props.managersSort}
          setOffset={this.props.setManagersOffset}
          setLimit={this.props.setManagersLimit}
          setSort={this.props.setManagersSort}
          page={this.props.managersPage}
          headerCells={managersTableHeaders}
          rows={(this.props.managersTableData.managers as any) || []}
          totalElements={this.props.managersTableData.totalRows || 0}
          fetchTableData={this.fetchTableData.bind(this)}
          onClick={this.openManager.bind(this)}
        ></RepresentationalTable>
        <Button
          sx={{ margin: 2, height: '50px', width: '300px' }}
          onClick={() => this.props.startCreatingNewManager()}
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
    managersTableData,
    managersOffset,
    managersLimit,
    managersSort,
    managersPage,
    redirectToManagerId,
    isCreatingNewManager,
    singleManagerData,
  } = state.managers;

  return {
    managersTableData,
    managersOffset,
    managersLimit,
    managersSort,
    managersPage,
    redirectToManagerId,
    isCreatingNewManager,
    singleManagerData,
  };
};

const mapDispatchToProps = {
  setManagersData,
  resetManagersData,
  setManagersOffset,
  setManagersLimit,
  setManagersSort,
  setRedirectToManagerId,
  startCreatingNewManager,
  setSingleManagerData,
  clearSingleManagerData,
  resetRedirectToManagerId,
  endCreatingNewManager,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export const ManagersPage = connector(Managers);

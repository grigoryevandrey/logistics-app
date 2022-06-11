import React, { Component } from 'react';
import { Dashboard } from '../../layouts';
import { AdminsClient } from '../../clients';
import {
  resetAdminsData,
  setAdminsData,
  setAdminsOffset,
  setAdminsLimit,
  setAdminsSort,
  setRedirectToAdminId,
  startCreatingNewAdmin,
  setSingleAdminData,
  clearSingleAdminData,
  resetRedirectToAdminId,
  endCreatingNewAdmin,
} from '../../reducers';
import { RootState } from '../../store';
import { connect, ConnectedProps } from 'react-redux';
import { Box } from '@mui/system';
import { RepresentationalTable, EditablePage } from '../../components';
import { AdminRole, AdminsSort, EditableElementType } from '../../enums';
import { Button } from '@mui/material';

interface AdminsPageProps extends PropsFromRedux {}

const adminsTableHeaders = [
  {
    label: 'Имя',
    key: ['lastName', 'firstName', 'patronymic'],
    isSortable: true,
    ascSortString: AdminsSort.NameAsc,
    descSortString: AdminsSort.NameDesc,
  },
  { label: 'ID', key: 'id', isSortable: false },
];

class Admins extends Component<AdminsPageProps> {
  constructor(props: AdminsPageProps) {
    super(props);
  }

  private readonly client = AdminsClient;

  public override async componentDidMount() {
    await this.fetchTableData();
  }

  private async fetchTableData(): Promise<void> {
    const data = await this.client.getAll(this.props.adminsLimit, this.props.adminsOffset, this.props.adminsSort);

    await this.props.setAdminsData(data);
  }

  private async openAdmin(id: number): Promise<void> {
    await this.props.setRedirectToAdminId(id);
  }

  private get component(): JSX.Element {
    if (this.props.redirectToAdminId || this.props.isCreatingNewAdmin)
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
            {
              type: EditableElementType.Selectable,
              label: 'Уровень доступа',
              stateKey: 'role',
              options: [
                {
                  value: AdminRole.Regular,
                  text: 'Обычный',
                },
                {
                  value: AdminRole.Super,
                  text: 'Максимальный',
                },
              ],
            },
          ]}
          isCreatingNewElement={this.props.isCreatingNewAdmin}
          client={AdminsClient}
          endCreatingNewElement={this.props.endCreatingNewAdmin}
          currentId={this.props.redirectToAdminId}
          resetCurrentId={this.props.resetRedirectToAdminId}
          stateData={this.props.singleAdminData}
          setStateData={this.props.setSingleAdminData}
          clearStateData={this.props.clearSingleAdminData}
        />
      );

    return (
      <Box>
        <RepresentationalTable
          offset={this.props.adminsOffset}
          limit={this.props.adminsLimit}
          sort={this.props.adminsSort}
          setOffset={this.props.setAdminsOffset}
          setLimit={this.props.setAdminsLimit}
          setSort={this.props.setAdminsSort}
          page={this.props.adminsPage}
          headerCells={adminsTableHeaders}
          rows={(this.props.adminsTableData.admins as any) || []}
          totalElements={this.props.adminsTableData.totalRows || 0}
          fetchTableData={this.fetchTableData.bind(this)}
          onClick={this.openAdmin.bind(this)}
        ></RepresentationalTable>
        <Button
          sx={{ margin: 2, height: '50px', width: '300px' }}
          onClick={() => this.props.startCreatingNewAdmin()}
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
    adminsTableData,
    adminsOffset,
    adminsLimit,
    adminsSort,
    adminsPage,
    redirectToAdminId,
    isCreatingNewAdmin,
    singleAdminData,
  } = state.admins;

  return {
    adminsTableData,
    adminsOffset,
    adminsLimit,
    adminsSort,
    adminsPage,
    redirectToAdminId,
    isCreatingNewAdmin,
    singleAdminData,
  };
};

const mapDispatchToProps = {
  setAdminsData,
  resetAdminsData,
  setAdminsOffset,
  setAdminsLimit,
  setAdminsSort,
  setRedirectToAdminId,
  startCreatingNewAdmin,
  setSingleAdminData,
  clearSingleAdminData,
  resetRedirectToAdminId,
  endCreatingNewAdmin,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export const AdminsPage = connector(Admins);

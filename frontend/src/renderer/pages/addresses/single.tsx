import React from 'react';
import { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../store';
import { setSingleAddressData, clearSingleAddressData, resetRedirectToId, endCreatingNewElement } from '../../reducers';
import { AddressesClient } from '../../clients';
import { Button, Paper, TextField } from '@mui/material';

interface AddressPageProps extends PropsFromRedux {
  fetchTableData: Function;
}

class Address extends Component<AddressPageProps> {
  private readonly client = AddressesClient;

  public override async componentDidMount() {
    await this.props.clearSingleAddressData();
    if (!this.props.isCreatingNewElement) await this.fetchData();
  }

  private async fetchData(): Promise<void> {
    const data = await this.client.getOne(this.props.redirectToId);
    await this.props.setSingleAddressData(data);
  }

  private async updateData(): Promise<void> {
    const data = this.props.singleAddressData;
    const newData = await this.client.update(data);
    await this.props.setSingleAddressData(newData);
    await this.props.fetchTableData();
  }

  private async createNew(): Promise<void> {
    const data = this.props.singleAddressData;
    await this.client.post(data);
    await this.props.fetchTableData();

    this.props.endCreatingNewElement();
  }

  private async delete(): Promise<void> {
    const id = this.props.singleAddressData.id;
    await this.client.delete(id);
    await this.props.resetRedirectToId();
    await this.props.fetchTableData();
  }

  public override render(): JSX.Element {
    return (
      <Paper sx={{ width: '330px', mb: 2, display: 'flex', flexDirection: 'column' }}>
        <TextField
          sx={{ margin: 2, width: '300px' }}
          label="Адрес"
          InputLabelProps={{ shrink: true }}
          value={this.props.singleAddressData.address}
          onChange={(e) =>
            this.props.setSingleAddressData({ ...this.props.singleAddressData, address: e.target.value })
          }
        />
        <TextField
          sx={{ margin: 2, width: '300px' }}
          InputLabelProps={{ shrink: true }}
          label="Широта"
          value={this.props.singleAddressData.latitude}
          onChange={(e) =>
            this.props.setSingleAddressData({ ...this.props.singleAddressData, latitude: e.target.value })
          }
        />
        <TextField
          sx={{ margin: 2, width: '300px' }}
          label="Долгота"
          InputLabelProps={{ shrink: true }}
          value={this.props.singleAddressData.longitude}
          onChange={(e) =>
            this.props.setSingleAddressData({ ...this.props.singleAddressData, longitude: e.target.value })
          }
        />
        <Button
          sx={{ margin: 2, height: '50px', width: '300px' }}
          variant="contained"
          onClick={this.props.isCreatingNewElement ? this.createNew.bind(this) : this.updateData.bind(this)}
        >
          {this.props.isCreatingNewElement ? 'Создать' : 'Сохранить изменения'}
        </Button>
        <Button
          sx={{ margin: 2, height: '50px', width: '300px' }}
          onClick={
            this.props.isCreatingNewElement
              ? () => this.props.endCreatingNewElement()
              : () => this.props.resetRedirectToId()
          }
          variant="contained"
        >
          {this.props.isCreatingNewElement ? 'Отмена' : 'Назад'}
        </Button>
        {!this.props.isCreatingNewElement ? (
          <Button
            sx={{ margin: 2, height: '50px', width: '300px' }}
            onClick={this.delete.bind(this)}
            variant="contained"
            color="error"
          >
            Удалить
          </Button>
        ) : null}
      </Paper>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  const { singleAddressData, redirectToId, isCreatingNewElement } = state.addresses;

  return { singleAddressData, redirectToId, isCreatingNewElement };
};

const mapDispatchToProps = {
  setSingleAddressData,
  clearSingleAddressData,
  resetRedirectToId,
  endCreatingNewElement,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export const SingleAddressPage = connector(Address);

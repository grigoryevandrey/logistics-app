import React from 'react';
import { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../store';
import { openSnackbar, closeSnackbar, openBackdrop, closeBackdrop, setDialog, resetDialog } from '../../reducers';
import { Button, Paper, TextField } from '@mui/material';
import { EntityClient } from '../../interfaces';
import { EditableElementType } from '../../enums';

type EditableElement = {
  type: EditableElementType;
  label: string;
  stateKey: string;
};

interface EditablePageProps extends PropsFromRedux {
  fetchTableData: Function;
  elements: EditableElement[];
  isCreatingNewElement: boolean;
  client: EntityClient;
  endCreatingNewElement: Function;
  currentId: number;
  resetCurrentId: Function;
  stateData: any;
  setStateData: Function;
  clearStateData: Function;
  customDeleteMessage?: string;
}

class Page extends Component<EditablePageProps> {
  public override async componentDidMount() {
    await this.props.clearStateData();
    if (!this.props.isCreatingNewElement) await this.fetchData();
  }

  private async fetchData(): Promise<void> {
    const data = await this.props.client.getOne(this.props.currentId);
    await this.props.setStateData(data);
  }

  private async handleError(e: any) {
    const message = e?.response?.data?.error || e?.message || 'Произошла ошибка.';

    await this.props.openSnackbar({ message, severity: 'error' });
  }

  private async openDeleteModal(): Promise<void> {
    const deleteMessage =
      this.props.customDeleteMessage ||
      `Вы уверены, что хотите удалить элемент c ID ${this.props.stateData.id}? Все связанные заказы будут удалены. Это действие невозможно отменить.`;

    this.props.setDialog({
      title: 'Подтвердите удаление',
      text: deleteMessage,
      open: true,
      yesAction: this.delete.bind(this),
      noAction: () => this.props.setDialog({ open: false }),
    });
  }

  private async updateData(): Promise<void> {
    try {
      await this.props.closeSnackbar();
      const data = this.props.stateData;
      const newData = await this.props.client.update(data);

      await this.props.openSnackbar({ message: 'Данные обновлены.', severity: 'success' });
      await this.props.setStateData(newData);
      await this.props.fetchTableData();
    } catch (e) {
      this.handleError(e);
    }
  }

  private async createNew(): Promise<void> {
    try {
      const data = this.props.stateData;
      await this.props.client.post(data);
      await this.props.fetchTableData();
      await this.props.openSnackbar({ message: 'Запись создана.', severity: 'success' });

      this.props.endCreatingNewElement();
    } catch (e) {
      this.handleError(e);
    }
  }

  private async delete(): Promise<void> {
    try {
      await this.props.setDialog({ open: false });
      const id = this.props.stateData.id;
      await this.props.client.delete(id);
      await this.props.resetCurrentId();
      await this.props.fetchTableData();
      await this.props.openSnackbar({ message: 'Запись была удалена.', severity: 'info' });
    } catch (e) {
      this.handleError(e);
    }
  }

  public override render(): JSX.Element {
    return (
      <Paper sx={{ width: '330px', mb: 2, display: 'flex', flexDirection: 'column' }}>
        {this.props.elements.map((element) => {
          switch (element.type) {
            case EditableElementType.Input: {
              return (
                <TextField
                  key={element.stateKey}
                  sx={{ margin: 2, width: '300px' }}
                  label={element.label}
                  InputLabelProps={{ shrink: true }}
                  value={this.props.stateData[element.stateKey]}
                  onChange={(e) =>
                    this.props.setStateData({ ...this.props.stateData, [element.stateKey]: e.target.value })
                  }
                />
              );
            }
            default: {
              throw new Error(`Unknown element type ${element.type}`);
            }
          }
        })}
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
              : () => this.props.resetCurrentId()
          }
          variant="contained"
        >
          {this.props.isCreatingNewElement ? 'Отмена' : 'Назад'}
        </Button>
        {!this.props.isCreatingNewElement ? (
          <Button
            sx={{ margin: 2, height: '50px', width: '300px' }}
            onClick={this.openDeleteModal.bind(this)}
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
  const { dialog } = state.global;

  return { dialog };
};

const mapDispatchToProps = {
  openSnackbar,
  closeSnackbar,
  openBackdrop,
  closeBackdrop,
  setDialog,
  resetDialog,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export const EditablePage = connector(Page);

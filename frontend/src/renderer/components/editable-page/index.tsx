import React from 'react';
import { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../store';
import { openSnackbar, closeSnackbar, openBackdrop, closeBackdrop, setDialog, resetDialog } from '../../reducers';
import {
  Button,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  FormControl,
  Autocomplete,
  CircularProgress,
} from '@mui/material';
import { EntityClient } from '../../interfaces';
import { EditableElementType } from '../../enums';

type EditableInput = {
  type: EditableElementType.Input;
  label: string;
  stateKey: string;
};

type Selectable = {
  type: EditableElementType.Selectable;
  label: string;
  stateKey: string;
  options: { text: string; value: string }[];
};

type AutocompleteElement = {
  type: EditableElementType.Autocomplete;
  label: string;
  stateKey: string;
  dataGetter: any;
  getterKey: string;
  state: any;
  stateSetter: any;
  keyOrder: string[];
};

type DateElement = {
  type: EditableElementType.Date;
  label: string;
  stateKey: string;
};

type EditableElement = EditableInput | Selectable | AutocompleteElement | DateElement;

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
  clearRelatedData?: Function;
  customDeleteMessage?: string;
}

class Page extends Component<EditablePageProps> {
  public override async componentDidMount() {
    await this.props.clearStateData();
    if (this.props.clearRelatedData) await this.props.clearRelatedData();
    if (!this.props.isCreatingNewElement) await this.fetchData();
    await this.fetchSubData();
  }

  private async fetchData(): Promise<void> {
    const data = await this.props.client.getOne(this.props.currentId);
    await this.props.setStateData(data);
  }

  private async fetchSubData(): Promise<void> {
    await Promise.all(
      this.props.elements.map(async (element: EditableElement) => {
        if (element.type === EditableElementType.Autocomplete) {
          await element.stateSetter({ isLoading: true });
          const data = await element.dataGetter();

          await element.stateSetter({ data: data[element.getterKey], isLoading: false });
        }
      }),
    );
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
      <Paper sx={{ width: '660px', mb: 2, display: 'flex', flexDirection: 'column' }}>
        {this.props.elements.map((element) => {
          switch (element.type) {
            case EditableElementType.Input: {
              return (
                <TextField
                  key={element.stateKey}
                  sx={{ margin: 2, width: '600px' }}
                  InputLabelProps={{ shrink: true }}
                  label={element.label}
                  value={this.props.stateData[element.stateKey]}
                  onChange={(e) =>
                    this.props.setStateData({ ...this.props.stateData, [element.stateKey]: e.target.value })
                  }
                />
              );
            }
            case EditableElementType.Selectable: {
              return (
                <FormControl key={element.stateKey} sx={{ margin: 2, width: '600px' }}>
                  <InputLabel>{element.label}</InputLabel>
                  <Select
                    label={element.label}
                    onChange={(e) =>
                      this.props.setStateData({ ...this.props.stateData, [element.stateKey]: e.target.value })
                    }
                    value={this.props.stateData[element.stateKey]}
                  >
                    {element.options.map((item) => {
                      return (
                        <MenuItem value={item.value} key={`${element.stateKey}_${item.value}`}>
                          {item.text}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              );
            }
            case EditableElementType.Autocomplete: {
              const constructLabel = (option: any) => {
                return element.keyOrder.reduce((acc: string, key: string) => {
                  return (acc += `${option[key]} `);
                }, '');
              };

              return (
                <Autocomplete
                  sx={{ margin: 2, width: '600px' }}
                  key={element.stateKey}
                  open={element.state.open}
                  onOpen={() => element.stateSetter({ open: true })}
                  onClose={() => element.stateSetter({ open: false })}
                  value={
                    this.props.stateData[element.stateKey] &&
                    element.state.data.filter((data: any) => data.id === this.props.stateData[element.stateKey])[0]
                  }
                  getOptionLabel={constructLabel}
                  options={element.state.data}
                  onChange={(_: any, newValue: any) => {
                    this.props.setStateData({ [element.stateKey]: newValue?.id });
                  }}
                  loading={element.state.loading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={element.label}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {element.state.loading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                    />
                  )}
                />
              );
            }
            case EditableElementType.Date: {
              return (
                <TextField
                  key={element.stateKey}
                  label={element.label}
                  type="datetime-local"
                  value={this.props.stateData[element.stateKey].replace('Z', '')}
                  onChange={(e) =>
                    this.props.setStateData({
                      ...this.props.stateData,
                      [element.stateKey]: new Date(e.target.value).toISOString(),
                    })
                  }
                  sx={{ margin: 2, width: '600px' }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              );
            }
            default: {
              throw new Error(`Unknown element type ${element}`);
            }
          }
        })}
        <Button
          sx={{ margin: 2, height: '50px', width: '600px' }}
          variant="contained"
          onClick={this.props.isCreatingNewElement ? this.createNew.bind(this) : this.updateData.bind(this)}
        >
          {this.props.isCreatingNewElement ? 'Создать' : 'Сохранить изменения'}
        </Button>
        <Button
          sx={{ margin: 2, height: '50px', width: '600px' }}
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
            sx={{ margin: 2, height: '50px', width: '600px' }}
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

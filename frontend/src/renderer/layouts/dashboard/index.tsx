import {
  Alert,
  AlertColor,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
} from '@mui/material';
import React, { Component } from 'react';
import {
  ADDRESSES_PATH,
  ADMINS_PATH,
  DELIVERIES_PATH,
  DRIVERS_PATH,
  MANAGERS_PATH,
  VEHICLES_PATH,
} from '../../configuration';
import { AsideNav, MainContent, NavigationButton } from '../../components';
import { UserRole } from '../../enums';
import { RootState } from '../../store';
import { connect, ConnectedProps } from 'react-redux';
import { TopBar } from '../top-bar';
import { closeSnackbar, setDialog } from '../../reducers';

interface DashboardProps extends PropsFromRedux {
  content: any;
}

const SNACKBAR_MAX_DURATION = 6000;

const managerButtons = [
  <NavigationButton label="Заказы" path={DELIVERIES_PATH} />,
  <NavigationButton label="Адреса" path={ADDRESSES_PATH} />,
  <NavigationButton label="Транспорт" path={VEHICLES_PATH} />,
  <NavigationButton label="Водители" path={DRIVERS_PATH} />,
];

const regularAdminButtons = [...managerButtons, <NavigationButton label="Менеджеры" path={MANAGERS_PATH} />];

const superAdminButtons = [...regularAdminButtons, <NavigationButton label="Администраторы" path={ADMINS_PATH} />];

const navigationButtons = Object.freeze({
  [UserRole.None]: [],
  [UserRole.Manager]: managerButtons,
  [UserRole.Regular]: regularAdminButtons,
  [UserRole.Super]: superAdminButtons,
});

export class DashboardLayout extends Component<DashboardProps> {
  constructor(props: DashboardProps) {
    super(props);
  }

  public override render() {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexFlow: 'column',
        }}
      >
        <TopBar />
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={this.props.snackbar.open}
          autoHideDuration={SNACKBAR_MAX_DURATION}
          onClose={() => this.props.closeSnackbar()}
        >
          <Alert
            onClose={() => this.props.closeSnackbar()}
            severity={this.props.snackbar.severity as AlertColor}
            sx={{ width: '100%' }}
          >
            {this.props.snackbar.message}
          </Alert>
        </Snackbar>

        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={this.props.backdrop.open}>
          <CircularProgress color="inherit" />
        </Backdrop>

        <Dialog open={this.props.dialog.open} onClose={this.props.dialog.noAction}>
          <DialogTitle>{this.props.dialog.title}</DialogTitle>
          <DialogContent>
            <DialogContentText>{this.props.dialog.text}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.dialog.noAction}>Отмена</Button>
            <Button onClick={this.props.dialog.yesAction} autoFocus>
              Да
            </Button>
          </DialogActions>
        </Dialog>

        <Box
          sx={{
            flex: '1 1 auto',
            width: '100%',
            display: 'flex',
          }}
        >
          <AsideNav buttons={navigationButtons[this.props.role]} />
          <MainContent content={this.props.content} />
        </Box>
      </Box>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  const { role } = state.global.user;
  const { snackbar, backdrop, dialog } = state.global;

  return { role, snackbar, backdrop, dialog };
};

const mapDispatchToProps = {
  closeSnackbar,
  setDialog,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export const Dashboard = connector(DashboardLayout);

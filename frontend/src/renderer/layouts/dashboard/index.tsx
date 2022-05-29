import { Box } from '@mui/material';
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

interface DashboardProps extends PropsFromRedux {
  content: any;
}

const managerButtons = [
  <NavigationButton label="Заказы" path={DELIVERIES_PATH} />,
  <NavigationButton label="Адреса" path={ADDRESSES_PATH} />,
  <NavigationButton label="Транспорт" path={VEHICLES_PATH} />,
  <NavigationButton label="Водители" path={DRIVERS_PATH} />,
];

const regularAdminButtons = [...managerButtons, <NavigationButton label="Менеджеры" path={MANAGERS_PATH} />];

const superAdminButtons = [...regularAdminButtons, <NavigationButton label="Администраторы" path={ADMINS_PATH} />];

const navigationButtons = Object.freeze({
  [UserRole.none]: [],
  [UserRole.manager]: managerButtons,
  [UserRole.regular]: regularAdminButtons,
  [UserRole.super]: superAdminButtons,
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

  return { role };
};

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export const Dashboard = connector(DashboardLayout);

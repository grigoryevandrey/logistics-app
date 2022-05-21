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
import { AsideNav, MainContent, TopBar, NavigationButton } from '../../components';

interface DashboardProps {
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

export class Dashboard extends Component<DashboardProps> {
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
          <AsideNav buttons={superAdminButtons} />
          <MainContent content={this.props.content} />
        </Box>
      </Box>
    );
  }
}

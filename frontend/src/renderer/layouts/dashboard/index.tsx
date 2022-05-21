import { Box } from '@mui/material';
import React, { Component } from 'react';
import { ADDRESSES_PATH, DELIVERIES_PATH, DRIVERS_PATH, VEHICLES_PATH } from '../../configuration';
import { AsideNav, MainContent, TopBar, NavigationButton } from '../../components';

interface DashboardProps {
  content: any;
}

const managerButtons = [
  <NavigationButton label="Deliveries" path={DELIVERIES_PATH} />,
  <NavigationButton label="Addresses" path={ADDRESSES_PATH} />,
  <NavigationButton label="Vehicles" path={VEHICLES_PATH} />,
  <NavigationButton label="Drivers" path={DRIVERS_PATH} />,
];

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
          <AsideNav buttons={managerButtons} />
          <MainContent content={this.props.content} />
        </Box>
      </Box>
    );
  }
}

import { Box } from '@mui/material';
import React, { Component } from 'react';
import { AsideNav, MainContent, TopBar, NavigationButton } from '../../components';

interface DashboardProps {
  content: any;
}

const managerButtons = [
  <NavigationButton label="deliveries" />,
  <NavigationButton label="addresses" />,
  <NavigationButton label="vehicles" />,
  <NavigationButton label="drivers" />,
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

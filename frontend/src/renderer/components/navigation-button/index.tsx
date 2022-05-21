import { Box, Divider } from '@mui/material';
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

interface NavigationButtonProps {
  label: string;
  path: string;
}

export class NavigationButton extends Component<NavigationButtonProps> {
  constructor(props: NavigationButtonProps) {
    super(props);
  }

  public override render() {
    return (
      <Fragment key={this.props.label}>
        <Box
          sx={{
            padding: '2rem',
          }}
        >
          <Link to={this.props.path}> {this.props.label}</Link>
        </Box>
        <Divider />
      </Fragment>
    );
  }
}

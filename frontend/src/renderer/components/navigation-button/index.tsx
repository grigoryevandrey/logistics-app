import { MenuItem } from '@mui/material';
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
        <MenuItem
          to={this.props.path}
          component={Link}
          sx={{
            fontSize: '2rem',
            padding: '2rem',
          }}
        >
          {this.props.label}
        </MenuItem>
      </Fragment>
    );
  }
}

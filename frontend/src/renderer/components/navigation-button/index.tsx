import { Box, Divider } from '@mui/material';
import React, { Component } from 'react';

interface NavigationButtonProps {
  label: string;
}

export class NavigationButton extends Component<NavigationButtonProps> {
  constructor(props: NavigationButtonProps) {
    super(props);
  }

  public override render() {
    return (
      <>
        <Box
          sx={{
            padding: '2rem',
          }}
        >
          {this.props.label}
        </Box>
        <Divider />
      </>
    );
  }
}

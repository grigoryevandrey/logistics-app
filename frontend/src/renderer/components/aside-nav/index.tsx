import { Box, Divider } from '@mui/material';
import React, { Component, Fragment } from 'react';
import { nanoid } from 'nanoid';

interface AsideNavProps {
  buttons: any[];
}

export class AsideNav extends Component<AsideNavProps> {
  constructor(props: AsideNavProps) {
    super(props);
  }

  public override render() {
    return (
      <Box
        sx={{
          width: '25%',
          position: 'relative',
        }}
      >
        {this.props.buttons.map((button) => {
          return <Fragment key={nanoid()}>{button}</Fragment>;
        })}
        <Divider orientation="vertical" sx={{ position: 'absolute', right: '0', top: '0' }} />
      </Box>
    );
  }
}

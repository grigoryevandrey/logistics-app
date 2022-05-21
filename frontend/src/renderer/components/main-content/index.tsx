import { Box } from '@mui/material';
import React, { Component } from 'react';

interface MainContentProps {
  content: any;
}

export class MainContent extends Component<MainContentProps> {
  constructor(props: MainContentProps) {
    super(props);
  }

  public override render() {
    return (
      <Box
        sx={{
          width: '75%',
        }}
      >
        {this.props.content}
      </Box>
    );
  }
}

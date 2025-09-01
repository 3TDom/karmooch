import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const PortfolioList = () => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Portfolios
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
        >
          Create Portfolio
        </Button>
      </Box>
      
      <Typography variant="body1" color="textSecondary">
        Portfolio management features coming soon...
      </Typography>
    </Box>
  );
};

export default PortfolioList;

import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

const PortfolioDetail = () => {
  const { id } = useParams();

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Portfolio Details
      </Typography>
      
      <Typography variant="body1" color="textSecondary">
        Portfolio ID: {id}
      </Typography>
      
      <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
        Detailed portfolio view coming soon...
      </Typography>
    </Box>
  );
};

export default PortfolioDetail;

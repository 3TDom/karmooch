import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const Dashboard = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      const response = await axios.get(`${API_URL}/portfolios`);
      setPortfolios(response.data);
    } catch (error) {
      console.error('Error fetching portfolios:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/portfolios')}
        >
          Create Portfolio
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Portfolios
              </Typography>
              <Typography variant="h3" color="primary">
                {portfolios.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Investments
              </Typography>
              <Typography variant="h3" color="secondary">
                {portfolios.reduce((total, portfolio) => 
                  total + (portfolio.investments?.length || 0), 0
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Typography variant="body2" color="textSecondary">
                No recent activity
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {portfolios.length > 0 && (
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            Your Portfolios
          </Typography>
          <Grid container spacing={2}>
            {portfolios.slice(0, 3).map((portfolio) => (
              <Grid item xs={12} md={4} key={portfolio.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {portfolio.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {portfolio.description}
                    </Typography>
                    <Typography variant="body2">
                      {portfolio.investments?.length || 0} investments
                    </Typography>
                    <Button
                      size="small"
                      onClick={() => navigate(`/portfolios/${portfolio.id}`)}
                      sx={{ mt: 1 }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;

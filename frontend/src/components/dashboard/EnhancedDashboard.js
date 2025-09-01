import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as PortfolioIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const StatCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const ChartCard = styled(Card)(({ theme }) => ({
  height: '400px',
  display: 'flex',
  flexDirection: 'column',
}));

function EnhancedDashboard() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [portfolioSummaries, setPortfolioSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPortfolioSummaries();
  }, []);

  const fetchPortfolioSummaries = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/portfolios/summary', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setPortfolioSummaries(response.data);
    } catch (error) {
      setError('Failed to fetch portfolio data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (percentage) => {
    return `${percentage.toFixed(2)}%`;
  };

  // Calculate totals across all portfolios
  const totalValue = portfolioSummaries.reduce((sum, portfolio) => sum + parseFloat(portfolio.totalValue || 0), 0);
  const totalCost = portfolioSummaries.reduce((sum, portfolio) => sum + parseFloat(portfolio.totalCost || 0), 0);
  const totalGainLoss = totalValue - totalCost;
  const totalGainLossPercentage = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;
  const totalInvestments = portfolioSummaries.reduce((sum, portfolio) => sum + portfolio.investmentCount, 0);

  // Prepare data for charts
  const portfolioValueData = portfolioSummaries.map(portfolio => ({
    name: portfolio.name,
    value: parseFloat(portfolio.totalValue || 0),
    cost: parseFloat(portfolio.totalCost || 0),
    gainLoss: parseFloat(portfolio.totalGainLoss || 0)
  }));

  const portfolioPieData = portfolioSummaries
    .filter(portfolio => parseFloat(portfolio.totalValue || 0) > 0)
    .map(portfolio => ({
      name: portfolio.name,
      value: parseFloat(portfolio.totalValue || 0)
    }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  if (loading) {
    return (
      <StyledContainer maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </StyledContainer>
    );
  }

  if (error) {
    return (
      <StyledContainer maxWidth="lg">
        <Alert severity="error">{error}</Alert>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome back, {user?.firstName}! 👋
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Here's an overview of your investment portfolio
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Total Value
                  </Typography>
                  <Typography variant="h4" component="h2">
                    {formatCurrency(totalValue)}
                  </Typography>
                </Box>
                <MoneyIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </StatCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Total Gain/Loss
                  </Typography>
                  <Typography 
                    variant="h4" 
                    component="h2"
                    color={totalGainLoss >= 0 ? 'success.main' : 'error.main'}
                  >
                    {formatCurrency(totalGainLoss)}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    {totalGainLoss >= 0 ? (
                      <TrendingUpIcon sx={{ color: 'success.main', mr: 0.5 }} />
                    ) : (
                      <TrendingDownIcon sx={{ color: 'error.main', mr: 0.5 }} />
                    )}
                    <Typography 
                      variant="body2" 
                      color={totalGainLoss >= 0 ? 'success.main' : 'error.main'}
                    >
                      {formatPercentage(totalGainLossPercentage)}
                    </Typography>
                  </Box>
                </Box>
                {totalGainLoss >= 0 ? (
                  <TrendingUpIcon sx={{ fontSize: 40, color: 'success.main' }} />
                ) : (
                  <TrendingDownIcon sx={{ fontSize: 40, color: 'error.main' }} />
                )}
              </Box>
            </CardContent>
          </StatCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Portfolios
                  </Typography>
                  <Typography variant="h4" component="h2">
                    {portfolioSummaries.length}
                  </Typography>
                </Box>
                <PortfolioIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </StatCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Investments
                  </Typography>
                  <Typography variant="h4" component="h2">
                    {totalInvestments}
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </StatCard>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Portfolio Value Bar Chart */}
        <Grid item xs={12} lg={8}>
          <ChartCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Portfolio Values
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={portfolioValueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" name="Current Value" />
                  <Bar dataKey="cost" fill="#82ca9d" name="Total Cost" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </ChartCard>
        </Grid>

        {/* Portfolio Distribution Pie Chart */}
        <Grid item xs={12} lg={4}>
          <ChartCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Portfolio Distribution
              </Typography>
              {portfolioPieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={portfolioPieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {portfolioPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box display="flex" alignItems="center" justifyContent="center" height={300}>
                  <Typography color="text.secondary">
                    No portfolio data available
                  </Typography>
                </Box>
              )}
            </CardContent>
          </ChartCard>
        </Grid>

        {/* Portfolio Performance Line Chart */}
        <Grid item xs={12}>
          <ChartCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Portfolio Performance (Gain/Loss)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={portfolioValueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="gainLoss" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    name="Gain/Loss"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </ChartCard>
        </Grid>
      </Grid>

      {/* Portfolio List */}
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Your Portfolios
        </Typography>
        <Grid container spacing={2}>
          {portfolioSummaries.map((portfolio) => (
            <Grid item xs={12} sm={6} md={4} key={portfolio.id}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { boxShadow: 4 }
                }}
                onClick={() => navigate(`/portfolios/${portfolio.id}/investments`)}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {portfolio.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {portfolio.description || 'No description'}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2">Value:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {formatCurrency(portfolio.totalValue)}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2">Gain/Loss:</Typography>
                    <Chip
                      label={`${formatCurrency(portfolio.totalGainLoss)} (${formatPercentage(portfolio.totalGainLossPercentage)})`}
                      color={portfolio.totalGainLoss >= 0 ? 'success' : 'error'}
                      size="small"
                    />
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2">Investments:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {portfolio.investmentCount}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </StyledContainer>
  );
}

export default EnhancedDashboard;

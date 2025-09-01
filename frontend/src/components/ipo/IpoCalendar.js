import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Chip,
  Alert,
  CircularProgress,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
  Business as BusinessIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const IpoCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

function IpoCalendar() {
  const { token } = useAuth();
  const [ipoData, setIpoData] = useState({
    next30Days: [],
    currentMonth: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchIpoData();
  }, []);

  const fetchIpoData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const [next30DaysResponse, currentMonthResponse] = await Promise.all([
        axios.get('http://localhost:8080/api/ipo/calendar/next-30-days'),
        axios.get('http://localhost:8080/api/ipo/calendar/current-month')
      ]);
      
      setIpoData({
        next30Days: next30DaysResponse.data.ipoOfferings || [],
        currentMonth: currentMonthResponse.data.ipoOfferings || []
      });
    } catch (error) {
      setError('Failed to fetch IPO calendar data');
      console.error('IPO fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    if (!price) return 'TBD';
    return `$${price}`;
  };

  const getExchangeColor = (exchange) => {
    switch (exchange?.toLowerCase()) {
      case 'nasdaq':
      case 'nasdaq capital':
        return 'primary';
      case 'nyse':
        return 'secondary';
      case 'amex':
        return 'success';
      default:
        return 'default';
    }
  };

  const renderIpoTable = (ipoOfferings) => {
    if (ipoOfferings.length === 0) {
      return (
        <Box display="flex" alignItems="center" justifyContent="center" py={4}>
          <Typography color="text.secondary">
            No IPO offerings found for this period
          </Typography>
        </Box>
      );
    }

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Symbol</TableCell>
              <TableCell>Exchange</TableCell>
              <TableCell>Price Range</TableCell>
              <TableCell>Shares</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ipoOfferings.map((ipo, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <CalendarIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                    {formatDate(ipo.date)}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <BusinessIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                    {ipo.company || 'TBD'}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={ipo.symbol || 'TBD'} 
                    color="primary" 
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={ipo.exchange || 'TBD'} 
                    color={getExchangeColor(ipo.exchange)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <MoneyIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                    {formatPrice(ipo.price)}
                  </Box>
                </TableCell>
                <TableCell>
                  {ipo.shares ? ipo.shares.toLocaleString() : 'TBD'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderIpoCards = (ipoOfferings) => {
    if (ipoOfferings.length === 0) {
      return (
        <Box display="flex" alignItems="center" justifyContent="center" py={4}>
          <Typography color="text.secondary">
            No IPO offerings found for this period
          </Typography>
        </Box>
      );
    }

    return (
      <Grid container spacing={2}>
        {ipoOfferings.map((ipo, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <IpoCard>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Chip 
                    label={ipo.symbol || 'TBD'} 
                    color="primary" 
                    variant="outlined"
                  />
                  <Chip 
                    label={ipo.exchange || 'TBD'} 
                    color={getExchangeColor(ipo.exchange)}
                    size="small"
                  />
                </Box>
                
                <Typography variant="h6" gutterBottom>
                  {ipo.company || 'Company TBD'}
                </Typography>
                
                <Box mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    IPO Date
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {formatDate(ipo.date)}
                  </Typography>
                </Box>
                
                <Box mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    Price Range
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {formatPrice(ipo.price)}
                  </Typography>
                </Box>
                
                {ipo.shares && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Shares
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {ipo.shares.toLocaleString()}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </IpoCard>
          </Grid>
        ))}
      </Grid>
    );
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const currentData = activeTab === 0 ? ipoData.next30Days : ipoData.currentMonth;
  const currentPeriod = activeTab === 0 ? 'Next 30 Days' : 'Current Month';

  return (
    <StyledContainer maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            IPO Calendar
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Track upcoming Initial Public Offerings powered by{' '}
            <a 
              href="https://finnhub.io" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#1976d2', textDecoration: 'none' }}
            >
              Finnhub API
            </a>
          </Typography>
        </Box>
        <Tooltip title="Refresh IPO Data">
          <IconButton 
            onClick={fetchIpoData} 
            disabled={loading}
            color="primary"
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab 
            label={`Next 30 Days (${ipoData.next30Days.length})`} 
            icon={<TrendingUpIcon />}
          />
          <Tab 
            label={`Current Month (${ipoData.currentMonth.length})`} 
            icon={<CalendarIcon />}
          />
        </Tabs>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              {currentPeriod} IPO Offerings
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {currentData.length} offering{currentData.length !== 1 ? 's' : ''} found
            </Typography>
          </Box>
          
          {renderIpoTable(currentData)}
        </Box>
      )}
    </StyledContainer>
  );
}

export default IpoCalendar;

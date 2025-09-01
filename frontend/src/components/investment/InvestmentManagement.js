import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../contexts/AuthContext';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const InvestmentCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

function InvestmentManagement() {
  const { token } = useAuth();
  const { portfolioId } = useParams();
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState(null);

  // Form state
  const [investmentForm, setInvestmentForm] = useState({
    symbol: '',
    name: '',
    shares: '',
    purchasePrice: '',
    purchaseDate: ''
  });

  // Menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuInvestment, setMenuInvestment] = useState(null);

  useEffect(() => {
    fetchInvestments();
  }, [portfolioId]);

  const fetchInvestments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/portfolios/${portfolioId}/investments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setInvestments(response.data);
    } catch (error) {
      setError('Failed to fetch investments');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvestment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `http://localhost:8080/api/portfolios/${portfolioId}/investments`,
        {
          ...investmentForm,
          shares: parseFloat(investmentForm.shares),
          purchasePrice: parseFloat(investmentForm.purchasePrice)
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setInvestments([response.data, ...investments]);
      setSuccess('Investment added successfully!');
      setCreateDialogOpen(false);
      setInvestmentForm({
        symbol: '',
        name: '',
        shares: '',
        purchasePrice: '',
        purchaseDate: ''
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add investment');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateInvestment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.put(
        `http://localhost:8080/api/portfolios/${portfolioId}/investments/${selectedInvestment.id}`,
        {
          ...investmentForm,
          shares: parseFloat(investmentForm.shares),
          purchasePrice: parseFloat(investmentForm.purchasePrice)
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setInvestments(investments.map(inv => 
        inv.id === selectedInvestment.id ? response.data : inv
      ));
      setSuccess('Investment updated successfully!');
      setEditDialogOpen(false);
      setInvestmentForm({
        symbol: '',
        name: '',
        shares: '',
        purchasePrice: '',
        purchaseDate: ''
      });
      setSelectedInvestment(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update investment');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInvestment = async (investmentId) => {
    if (!window.confirm('Are you sure you want to delete this investment? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`http://localhost:8080/api/portfolios/${portfolioId}/investments/${investmentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setInvestments(investments.filter(inv => inv.id !== investmentId));
      setSuccess('Investment deleted successfully!');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete investment');
    } finally {
      setLoading(false);
      handleMenuClose();
    }
  };

  const handleMenuOpen = (event, investment) => {
    setAnchorEl(event.currentTarget);
    setMenuInvestment(investment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuInvestment(null);
  };

  const handleEditClick = () => {
    setSelectedInvestment(menuInvestment);
    setInvestmentForm({
      symbol: menuInvestment.symbol,
      name: menuInvestment.name,
      shares: menuInvestment.shares.toString(),
      purchasePrice: menuInvestment.purchasePrice.toString(),
      purchaseDate: menuInvestment.purchaseDate
    });
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculateTotalValue = (shares, price) => {
    return shares * price;
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  return (
    <StyledContainer maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Investment Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            clearMessages();
            setCreateDialogOpen(true);
          }}
        >
          Add Investment
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={clearMessages}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={clearMessages}>{success}</Alert>}

      {investments.length === 0 && !loading ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <TrendingUpIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No investments yet
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Add your first investment to start tracking your portfolio
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateDialogOpen(true)}
            >
              Add Your First Investment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Symbol</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="right">Shares</TableCell>
                <TableCell align="right">Purchase Price</TableCell>
                <TableCell align="right">Total Value</TableCell>
                <TableCell align="right">Purchase Date</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {investments.map((investment) => (
                <TableRow key={investment.id}>
                  <TableCell>
                    <Chip 
                      label={investment.symbol} 
                      color="primary" 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{investment.name}</TableCell>
                  <TableCell align="right">{investment.shares}</TableCell>
                  <TableCell align="right">{formatCurrency(investment.purchasePrice)}</TableCell>
                  <TableCell align="right">
                    {formatCurrency(calculateTotalValue(investment.shares, investment.purchasePrice))}
                  </TableCell>
                  <TableCell align="right">{formatDate(investment.purchaseDate)}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, investment)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Investment Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditClick}>Edit</MenuItem>
        <MenuItem 
          onClick={() => handleDeleteInvestment(menuInvestment?.id)}
          sx={{ color: 'error.main' }}
        >
          Delete
        </MenuItem>
      </Menu>

      {/* Create Investment Dialog */}
      <Dialog 
        open={createDialogOpen} 
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleCreateInvestment}>
          <DialogTitle>Add New Investment</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Symbol (e.g., AAPL)"
              value={investmentForm.symbol}
              onChange={(e) => setInvestmentForm({ ...investmentForm, symbol: e.target.value.toUpperCase() })}
              margin="normal"
              required
              autoFocus
            />
            <TextField
              fullWidth
              label="Company Name"
              value={investmentForm.name}
              onChange={(e) => setInvestmentForm({ ...investmentForm, name: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Number of Shares"
              type="number"
              value={investmentForm.shares}
              onChange={(e) => setInvestmentForm({ ...investmentForm, shares: e.target.value })}
              margin="normal"
              required
              inputProps={{ min: "0", step: "0.01" }}
            />
            <TextField
              fullWidth
              label="Purchase Price per Share"
              type="number"
              value={investmentForm.purchasePrice}
              onChange={(e) => setInvestmentForm({ ...investmentForm, purchasePrice: e.target.value })}
              margin="normal"
              required
              inputProps={{ min: "0", step: "0.01" }}
            />
            <TextField
              fullWidth
              label="Purchase Date"
              type="date"
              value={investmentForm.purchaseDate}
              onChange={(e) => setInvestmentForm({ ...investmentForm, purchaseDate: e.target.value })}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Adding...' : 'Add Investment'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Edit Investment Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleUpdateInvestment}>
          <DialogTitle>Edit Investment</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Symbol (e.g., AAPL)"
              value={investmentForm.symbol}
              onChange={(e) => setInvestmentForm({ ...investmentForm, symbol: e.target.value.toUpperCase() })}
              margin="normal"
              required
              autoFocus
            />
            <TextField
              fullWidth
              label="Company Name"
              value={investmentForm.name}
              onChange={(e) => setInvestmentForm({ ...investmentForm, name: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Number of Shares"
              type="number"
              value={investmentForm.shares}
              onChange={(e) => setInvestmentForm({ ...investmentForm, shares: e.target.value })}
              margin="normal"
              required
              inputProps={{ min: "0", step: "0.01" }}
            />
            <TextField
              fullWidth
              label="Purchase Price per Share"
              type="number"
              value={investmentForm.purchasePrice}
              onChange={(e) => setInvestmentForm({ ...investmentForm, purchasePrice: e.target.value })}
              margin="normal"
              required
              inputProps={{ min: "0", step: "0.01" }}
            />
            <TextField
              fullWidth
              label="Purchase Date"
              type="date"
              value={investmentForm.purchaseDate}
              onChange={(e) => setInvestmentForm({ ...investmentForm, purchaseDate: e.target.value })}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Updating...' : 'Update Investment'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </StyledContainer>
  );
}

export default InvestmentManagement;

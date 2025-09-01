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
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const PortfolioCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

function PortfolioManagement() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);

  // Form state
  const [portfolioForm, setPortfolioForm] = useState({
    name: '',
    description: ''
  });

  // Menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuPortfolio, setMenuPortfolio] = useState(null);

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/portfolios', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setPortfolios(response.data);
    } catch (error) {
      setError('Failed to fetch portfolios');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePortfolio = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:8080/api/portfolios',
        portfolioForm,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setPortfolios([response.data, ...portfolios]);
      setSuccess('Portfolio created successfully!');
      setCreateDialogOpen(false);
      setPortfolioForm({ name: '', description: '' });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create portfolio');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePortfolio = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.put(
        `http://localhost:8080/api/portfolios/${selectedPortfolio.id}`,
        portfolioForm,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setPortfolios(portfolios.map(p => 
        p.id === selectedPortfolio.id ? response.data : p
      ));
      setSuccess('Portfolio updated successfully!');
      setEditDialogOpen(false);
      setPortfolioForm({ name: '', description: '' });
      setSelectedPortfolio(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update portfolio');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePortfolio = async (portfolioId) => {
    if (!window.confirm('Are you sure you want to delete this portfolio? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`http://localhost:8080/api/portfolios/${portfolioId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setPortfolios(portfolios.filter(p => p.id !== portfolioId));
      setSuccess('Portfolio deleted successfully!');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete portfolio');
    } finally {
      setLoading(false);
      handleMenuClose();
    }
  };

  const handleMenuOpen = (event, portfolio) => {
    setAnchorEl(event.currentTarget);
    setMenuPortfolio(portfolio);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuPortfolio(null);
  };

  const handleEditClick = () => {
    setSelectedPortfolio(menuPortfolio);
    setPortfolioForm({
      name: menuPortfolio.name,
      description: menuPortfolio.description || ''
    });
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  return (
    <StyledContainer maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Portfolio Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            clearMessages();
            setCreateDialogOpen(true);
          }}
        >
          Create Portfolio
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={clearMessages}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={clearMessages}>{success}</Alert>}

      {portfolios.length === 0 && !loading ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <TrendingUpIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No portfolios yet
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Create your first portfolio to start managing your investments
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateDialogOpen(true)}
            >
              Create Your First Portfolio
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {portfolios.map((portfolio) => (
            <Grid item xs={12} sm={6} md={4} key={portfolio.id}>
              <PortfolioCard>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Typography variant="h6" component="h2" gutterBottom>
                      {portfolio.name}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, portfolio)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {portfolio.description || 'No description provided'}
                  </Typography>
                  
                  <Box mt={2}>
                    <Chip
                      label={`Created ${formatDate(portfolio.createdAt)}`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
                
                <CardActions>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    fullWidth
                    onClick={() => navigate(`/portfolios/${portfolio.id}/investments`)}
                  >
                    Manage Investments
                  </Button>
                </CardActions>
              </PortfolioCard>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Portfolio Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditClick}>Edit</MenuItem>
        <MenuItem 
          onClick={() => handleDeletePortfolio(menuPortfolio?.id)}
          sx={{ color: 'error.main' }}
        >
          Delete
        </MenuItem>
      </Menu>

      {/* Create Portfolio Dialog */}
      <Dialog 
        open={createDialogOpen} 
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleCreatePortfolio}>
          <DialogTitle>Create New Portfolio</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Portfolio Name"
              value={portfolioForm.name}
              onChange={(e) => setPortfolioForm({ ...portfolioForm, name: e.target.value })}
              margin="normal"
              required
              autoFocus
            />
            <TextField
              fullWidth
              label="Description (Optional)"
              value={portfolioForm.description}
              onChange={(e) => setPortfolioForm({ ...portfolioForm, description: e.target.value })}
              margin="normal"
              multiline
              rows={3}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Creating...' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Edit Portfolio Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleUpdatePortfolio}>
          <DialogTitle>Edit Portfolio</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Portfolio Name"
              value={portfolioForm.name}
              onChange={(e) => setPortfolioForm({ ...portfolioForm, name: e.target.value })}
              margin="normal"
              required
              autoFocus
            />
            <TextField
              fullWidth
              label="Description (Optional)"
              value={portfolioForm.description}
              onChange={(e) => setPortfolioForm({ ...portfolioForm, description: e.target.value })}
              margin="normal"
              multiline
              rows={3}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Updating...' : 'Update'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </StyledContainer>
  );
}

export default PortfolioManagement;

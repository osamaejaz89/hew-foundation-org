import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Stack,
  Alert,
  Snackbar,
  Tooltip,
  Checkbox,
  FormControlLabel,
  Switch,
  Divider,
  Avatar,
  Badge,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Family, FamilyFilters, UpdateFamilyPayload, BulkUpdatePayload } from '../../types/family';
import { 
  getAllFamilies, 
  updateFamily, 
  deleteFamily, 
  bulkUpdateFamilies, 
  exportFamilyData 
} from '../../services/adminService';
import { toast } from 'react-toastify';

const AdminFamilies: React.FC = () => {
  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FamilyFilters>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [totalFamilies, setTotalFamilies] = useState(0);
  const [selectedFamilies, setSelectedFamilies] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [bulkUpdateDialogOpen, setBulkUpdateDialogOpen] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);
  const [editForm, setEditForm] = useState<UpdateFamilyPayload>({
    familyCode: '',
    name: '',
    description: '',
  });
  const [bulkUpdateForm, setBulkUpdateForm] = useState<Partial<UpdateFamilyPayload>>({});

  useEffect(() => {
    loadFamilies();
  }, [filters]);

  const loadFamilies = async () => {
    setLoading(true);
    try {
      const response = await getAllFamilies(filters);
      setFamilies(response.data);
      setTotalFamilies(response.total);
    } catch (error) {
      console.error('Error loading families:', error);
      toast.error('Failed to load families');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      search: searchTerm,
      page: 1,
    }));
  };

  const handleEditClick = (family: Family) => {
    setSelectedFamily(family);
    setEditForm({
      familyCode: family.familyCode,
      name: family.name || '',
      description: family.description || '',
    });
    setEditDialogOpen(true);
  };

  const handleViewClick = (family: Family) => {
    setSelectedFamily(family);
    setViewDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedFamily) return;
    try {
      await updateFamily(selectedFamily.familyCode, editForm);
      setEditDialogOpen(false);
      loadFamilies();
      toast.success('Family updated successfully');
    } catch (error) {
      console.error('Error updating family:', error);
      toast.error('Failed to update family');
    }
  };

  const handleDeleteFamily = async (familyCode: string) => {
    if (window.confirm('Are you sure you want to delete this family? This action cannot be undone.')) {
      try {
        await deleteFamily(familyCode);
        loadFamilies();
        toast.success('Family deleted successfully');
      } catch (error) {
        console.error('Error deleting family:', error);
        toast.error('Failed to delete family');
      }
    }
  };

  const handleBulkUpdate = async () => {
    if (selectedFamilies?.length === 0) {
      toast.warning('Please select families to update');
      return;
    }

    try {
      const payload: BulkUpdatePayload = {
        familyCodes: selectedFamilies || [],
        updates: bulkUpdateForm,
      };
      await bulkUpdateFamilies(payload);
      setBulkUpdateDialogOpen(false);
      setSelectedFamilies([]);
      loadFamilies();
      toast.success('Families updated successfully');
    } catch (error) {
      console.error('Error bulk updating families:', error);
      toast.error('Failed to update families');
    }
  };

  const handleExport = async (format: 'json' | 'csv') => {
    try {
      const blob = await exportFamilyData({ format, filters });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `families-export.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success(`Export completed: families-export.${format}`);
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFamilies((families || []).map(f => f.familyCode));
    } else {
      setSelectedFamilies([]);
    }
  };

  const handleSelectFamily = (familyCode: string, checked: boolean) => {
    if (checked) {
      setSelectedFamilies(prev => [...(prev || []), familyCode]);
    } else {
      setSelectedFamilies(prev => (prev || []).filter(code => code !== familyCode));
    }
  };

  const getStatusColor = (isActive?: boolean) => {
    return isActive ? 'success' : 'error';
  };

  const getStatusLabel = (isActive?: boolean) => {
    return isActive ? 'Active' : 'Inactive';
  };

  // Helper function to get member count from members array
  const getMemberCount = (family: Family) => {
    return family.members?.length || family.memberCount || 0;
  };

  // Helper function to get family name
  const getFamilyName = (family: Family) => {
    if (family.name) return family.name;
    if (family.userId?.name) return `${family.userId.name}'s Family`;
    return `Family ${family.familyCode}`;
  };

  // Helper function to get family description
  const getFamilyDescription = (family: Family) => {
    if (family.description) return family.description;
    return `Family with ${getMemberCount(family)} members`;
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Family Management
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => handleExport('csv')}
          >
            Export CSV
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => handleExport('json')}
          >
            Export JSON
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setBulkUpdateDialogOpen(true)}
            disabled={selectedFamilies?.length === 0}
          >
            Bulk Update ({selectedFamilies?.length || 0})
          </Button>
        </Stack>
      </Box>

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search families..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                  label="Sort By"
                >
                  <MenuItem value="createdAt">Created Date</MenuItem>
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="familyCode">Family Code</MenuItem>
                  <MenuItem value="memberCount">Member Count</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Sort Order</InputLabel>
                <Select
                  value={filters.sortOrder}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortOrder: e.target.value as 'asc' | 'desc' }))}
                  label="Sort Order"
                >
                  <MenuItem value="desc">Descending</MenuItem>
                  <MenuItem value="asc">Ascending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value || undefined }))}
                  label="Status"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  onClick={handleSearch}
                  startIcon={<SearchIcon />}
                >
                  Search
                </Button>
                <Button
                  variant="outlined"
                  onClick={loadFamilies}
                  startIcon={<RefreshIcon />}
                >
                  Refresh
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Families Table */}
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Families ({totalFamilies})
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Showing {(families || []).length} of {totalFamilies} families
            </Typography>
          </Box>
          
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'grey.50' }}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedFamilies?.length === (families || []).length && (families || []).length > 0}
                      indeterminate={selectedFamilies?.length > 0 && selectedFamilies?.length < (families || []).length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </TableCell>
                  <TableCell>Family Code</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Members</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(families || []).map((family) => (
                  <TableRow key={family._id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedFamilies.includes(family.familyCode)}
                        onChange={(e) => handleSelectFamily(family.familyCode, e.target.checked)}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {family.familyCode}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {getFamilyName(family)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
                        {getFamilyDescription(family)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getMemberCount(family)}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(family.isActive)}
                        color={getStatusColor(family.isActive) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(family.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="View Details">
                          <IconButton size="small" onClick={() => handleViewClick(family)}>
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Family">
                          <IconButton size="small" onClick={() => handleEditClick(family)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Family">
                          <IconButton 
                            size="small" 
                            onClick={() => handleDeleteFamily(family.familyCode)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination
              count={Math.ceil(totalFamilies / (filters.limit || 10))}
              page={filters.page || 1}
              onChange={(_, page) => setFilters(prev => ({ ...prev, page }))}
              color="primary"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Family</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Family Code"
              value={editForm.familyCode}
              onChange={(e) => setEditForm(prev => ({ ...prev, familyCode: e.target.value }))}
            />
            <TextField
              fullWidth
              label="Name"
              value={editForm.name}
              onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter family name"
            />
            <TextField
              fullWidth
              label="Description"
              value={editForm.description}
              onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
              multiline
              rows={3}
              placeholder="Enter family description"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Family Details</DialogTitle>
        <DialogContent>
          {selectedFamily && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Family Code</Typography>
                <Typography variant="body1" fontWeight="medium">{selectedFamily.familyCode}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                <Typography variant="body1" fontWeight="medium">{getFamilyName(selectedFamily)}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                <Typography variant="body1">{getFamilyDescription(selectedFamily)}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Member Count</Typography>
                <Typography variant="body1">{getMemberCount(selectedFamily)}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                <Chip
                  label={getStatusLabel(selectedFamily.isActive)}
                  color={getStatusColor(selectedFamily.isActive) as any}
                  size="small"
                />
              </Grid>
              {selectedFamily.userId && (
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Owner</Typography>
                  <Typography variant="body1">{selectedFamily.userId.name}</Typography>
                </Grid>
              )}
              {selectedFamily.userId && (
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Owner Email</Typography>
                  <Typography variant="body1">{selectedFamily.userId.email}</Typography>
                </Grid>
              )}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Created</Typography>
                <Typography variant="body1">
                  {new Date(selectedFamily.createdAt).toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Last Updated</Typography>
                <Typography variant="body1">
                  {new Date(selectedFamily.updatedAt).toLocaleString()}
                </Typography>
              </Grid>
              {selectedFamily.members && selectedFamily.members.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>Family Members</Typography>
                  <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                    {selectedFamily.members.map((member, index) => (
                      <Box key={member._id} sx={{ mb: 1, p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                        <Typography variant="body2" fontWeight="medium">
                          {member.firstName} {member.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {member.gender} • {new Date(member.dateOfBirth).toLocaleDateString()} • {member.isTemporaryMember ? 'Temporary' : 'Permanent'}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Update Dialog */}
      <Dialog open={bulkUpdateDialogOpen} onClose={() => setBulkUpdateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Bulk Update Families</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Update {selectedFamilies?.length || 0} selected families
          </Typography>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Family Code"
              value={bulkUpdateForm.familyCode || ''}
              onChange={(e) => setBulkUpdateForm(prev => ({ ...prev, familyCode: e.target.value }))}
              placeholder="Leave empty to keep current value"
            />
            <TextField
              fullWidth
              label="Name"
              value={bulkUpdateForm.name || ''}
              onChange={(e) => setBulkUpdateForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Leave empty to keep current value"
            />
            <TextField
              fullWidth
              label="Description"
              value={bulkUpdateForm.description || ''}
              onChange={(e) => setBulkUpdateForm(prev => ({ ...prev, description: e.target.value }))}
              multiline
              rows={3}
              placeholder="Leave empty to keep current value"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkUpdateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleBulkUpdate} variant="contained">Update All</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminFamilies; 
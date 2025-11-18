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
  Avatar,
  Tooltip,
  Checkbox,
  FormControlLabel,
  Switch,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  Person as PersonIcon,
  People as PeopleIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { FamilyMember, MemberFilters, UpdateFamilyMemberPayload, UpdateMemberStatusPayload } from '../../types/family';
import { 
  getAllFamilyMembers, 
  updateFamilyMemberAdmin, 
  updateMemberStatus, 
  deleteFamilyMemberAdmin 
} from '../../services/adminService';
import { toast } from 'react-toastify';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`member-tabpanel-${index}`}
      aria-labelledby={`member-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminFamilyMembers: React.FC = () => {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<MemberFilters>({
    page: 1,
    limit: 10,
  });
  const [totalMembers, setTotalMembers] = useState(0);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [relationshipFilter, setRelationshipFilter] = useState('');

  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [editForm, setEditForm] = useState<UpdateFamilyMemberPayload>({});
  const [statusForm, setStatusForm] = useState<UpdateMemberStatusPayload>({
    status: 'active' as const,
    isTemporaryMember: false,
  });
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    loadMembers();
  }, [filters]);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const response = await getAllFamilyMembers(filters);
      setMembers(response.data);
      setTotalMembers(response.total);
    } catch (error) {
      console.error('Error loading members:', error);
      toast.error('Failed to load family members');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      search: searchTerm,
      gender: genderFilter || undefined,
      status: statusFilter || undefined,
      relationshipType: relationshipFilter || undefined,
      page: 1,
    }));
  };

  const handleEditClick = (member: FamilyMember) => {
    setSelectedMember(member);
    setEditForm({
      firstName: member.firstName,
      lastName: member.lastName,
      dateOfBirth: member.dateOfBirth,
      gender: member.gender,
      birthPlace: member.birthPlace,
      currentLocation: member.currentLocation,
      occupation: member.occupation,
      education: member.education,
      biography: member.biography,
      profilePicture: member.profilePicture,
      relationshipType: member.relationshipType,
      isTemporaryMember: member.isTemporaryMember,
    });
    setEditDialogOpen(true);
  };

  const handleViewClick = (member: FamilyMember) => {
    setSelectedMember(member);
    setViewDialogOpen(true);
  };

  const handleStatusClick = (member: FamilyMember) => {
    setSelectedMember(member);
    setStatusForm({
      status: member.status || 'active',
      isTemporaryMember: member.isTemporaryMember || false,
      userId: member.userId,
    });
    setStatusDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedMember) return;
    try {
      await updateFamilyMemberAdmin(selectedMember._id, editForm);
      setEditDialogOpen(false);
      loadMembers();
      toast.success('Member updated successfully');
    } catch (error) {
      console.error('Error updating member:', error);
      toast.error('Failed to update member');
    }
  };

  const handleStatusSubmit = async () => {
    if (!selectedMember) return;
    try {
      await updateMemberStatus(selectedMember._id, statusForm);
      setStatusDialogOpen(false);
      loadMembers();
      toast.success('Member status updated successfully');
    } catch (error) {
      console.error('Error updating member status:', error);
      toast.error('Failed to update member status');
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (window.confirm('Are you sure you want to delete this member? This action cannot be undone.')) {
      try {
        await deleteFamilyMemberAdmin(memberId);
        loadMembers();
        toast.success('Member deleted successfully');
      } catch (error) {
        console.error('Error deleting member:', error);
        toast.error('Failed to delete member');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getGenderColor = (gender: string) => {
    switch (gender) {
      case 'male': return 'primary';
      case 'female': return 'secondary';
      default: return 'default';
    }
  };

  const getAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMembers((members || []).map(m => m._id).filter(Boolean) as string[]);
    } else {
      setSelectedMembers([]);
    }
  };

  const handleSelectMember = (memberId: string, checked: boolean) => {
    if (checked) {
      setSelectedMembers(prev => [...(prev || []), memberId]);
    } else {
      setSelectedMembers(prev => (prev || []).filter(id => id !== memberId));
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Family Members Management
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            onClick={loadMembers}
            startIcon={<RefreshIcon />}
          >
            Refresh
          </Button>
        </Stack>
      </Box>

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Search members..."
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
                <InputLabel>Gender</InputLabel>
                <Select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                  label="Gender"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Relationship</InputLabel>
                <Select
                  value={relationshipFilter}
                  onChange={(e) => setRelationshipFilter(e.target.value)}
                  label="Relationship"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="parent">Parent</MenuItem>
                  <MenuItem value="child">Child</MenuItem>
                  <MenuItem value="spouse">Spouse</MenuItem>
                  <MenuItem value="sibling">Sibling</MenuItem>
                  <MenuItem value="grandparent">Grandparent</MenuItem>
                  <MenuItem value="grandchild">Grandchild</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
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
                  onClick={() => {
                    setSearchTerm('');
                    setGenderFilter('');
                    setStatusFilter('');
                    setRelationshipFilter('');
                    setFilters({ page: 1, limit: 10 });
                  }}
                >
                  Clear
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Family Members ({totalMembers})
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Showing {(members || []).length} of {totalMembers} members
            </Typography>
          </Box>
          
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'grey.50' }}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedMembers?.length === (members || []).length && (members || []).length > 0}
                      indeterminate={selectedMembers?.length > 0 && selectedMembers?.length < (members || []).length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </TableCell>
                  <TableCell>Member</TableCell>
                  <TableCell>Family</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Occupation</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(members || []).map((member) => (
                  <TableRow key={member._id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedMembers?.includes(member._id) || false}
                        onChange={(e) => handleSelectMember(member._id, e.target.checked)}
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar src={member.profilePicture}>
                          {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {member.firstName} {member.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {member.relationshipType}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={member.familyCode || member.familyId}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {getAge(member.dateOfBirth)} years
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={member.gender}
                        color={getGenderColor(member.gender) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 150 }}>
                        {member.currentLocation || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 150 }}>
                        {member.occupation || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Chip
                          label={member.status || 'active'}
                          color={getStatusColor(member.status || 'active') as any}
                          size="small"
                        />
                        {member.isTemporaryMember && (
                          <Chip
                            label="Temporary"
                            color="warning"
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="View Details">
                          <IconButton size="small" onClick={() => handleViewClick(member)}>
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Member">
                          <IconButton size="small" onClick={() => handleEditClick(member)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Update Status">
                          <IconButton size="small" onClick={() => handleStatusClick(member)}>
                            <MoreIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Member">
                          <IconButton 
                            size="small" 
                            onClick={() => handleDeleteMember(member._id)}
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
              count={Math.ceil(totalMembers / (filters.limit || 10))}
              page={filters.page || 1}
              onChange={(_, page) => setFilters(prev => ({ ...prev, page }))}
              color="primary"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Family Member</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="First Name"
                value={editForm.firstName || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={editForm.lastName || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date of Birth"
                  value={editForm.dateOfBirth ? new Date(editForm.dateOfBirth) : null}
                  onChange={(date) => setEditForm(prev => ({ 
                    ...prev, 
                    dateOfBirth: date ? date.toISOString() : undefined 
                  }))}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={editForm.gender || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, gender: e.target.value as any }))}
                  label="Gender"
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Birth Place"
                value={editForm.birthPlace || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, birthPlace: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Current Location"
                value={editForm.currentLocation || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, currentLocation: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Occupation"
                value={editForm.occupation || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, occupation: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Education"
                value={editForm.education || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, education: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Biography"
                value={editForm.biography || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, biography: e.target.value }))}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Profile Picture URL"
                value={editForm.profilePicture || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, profilePicture: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Relationship Type"
                value={editForm.relationshipType || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, relationshipType: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={editForm.isTemporaryMember || false}
                    onChange={(e) => setEditForm(prev => ({ ...prev, isTemporaryMember: e.target.checked }))}
                  />
                }
                label="Temporary Member"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Member Details</DialogTitle>
        <DialogContent>
          {selectedMember && (
            <Box>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
                  <Tab label="Basic Info" />
                  <Tab label="Family Info" />
                  <Tab label="Additional Info" />
                </Tabs>
              </Box>
              
              <TabPanel value={tabValue} index={0}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Box display="flex" flexDirection="column" alignItems="center">
                      <Avatar 
                        src={selectedMember.profilePicture}
                        sx={{ width: 120, height: 120, mb: 2 }}
                      >
                        {selectedMember.firstName.charAt(0)}{selectedMember.lastName.charAt(0)}
                      </Avatar>
                      <Typography variant="h6" fontWeight="bold">
                        {selectedMember.firstName} {selectedMember.lastName}
                      </Typography>
                      <Chip
                        label={selectedMember.relationshipType}
                        color="primary"
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <List>
                      <ListItem>
                        <ListItemAvatar>
                          <CalendarIcon />
                        </ListItemAvatar>
                        <ListItemText
                          primary="Date of Birth"
                          secondary={`${new Date(selectedMember.dateOfBirth).toLocaleDateString()} (${getAge(selectedMember.dateOfBirth)} years old)`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <PersonIcon />
                        </ListItemAvatar>
                        <ListItemText
                          primary="Gender"
                          secondary={selectedMember.gender}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <LocationIcon />
                        </ListItemAvatar>
                        <ListItemText
                          primary="Birth Place"
                          secondary={selectedMember.birthPlace || 'N/A'}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <LocationIcon />
                        </ListItemAvatar>
                        <ListItemText
                          primary="Current Location"
                          secondary={selectedMember.currentLocation || 'N/A'}
                        />
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <List>
                  <ListItem>
                    <ListItemAvatar>
                      <PeopleIcon />
                    </ListItemAvatar>
                    <ListItemText
                      primary="Family Code"
                      secondary={selectedMember.familyCode || selectedMember.familyId}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <PersonIcon />
                    </ListItemAvatar>
                    <ListItemText
                      primary="User ID"
                      secondary={selectedMember.userId || 'N/A'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <PersonIcon />
                    </ListItemAvatar>
                    <ListItemText
                      primary="Status"
                      secondary={
                        <Stack direction="row" spacing={1}>
                          <Chip
                            label={selectedMember.status || 'active'}
                            color={getStatusColor(selectedMember.status || 'active') as any}
                            size="small"
                          />
                          {selectedMember.isTemporaryMember && (
                            <Chip
                              label="Temporary"
                              color="warning"
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Stack>
                      }
                    />
                  </ListItem>
                </List>
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <List>
                  <ListItem>
                    <ListItemAvatar>
                      <WorkIcon />
                    </ListItemAvatar>
                    <ListItemText
                      primary="Occupation"
                      secondary={selectedMember.occupation || 'N/A'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <SchoolIcon />
                    </ListItemAvatar>
                    <ListItemText
                      primary="Education"
                      secondary={selectedMember.education || 'N/A'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <PersonIcon />
                    </ListItemAvatar>
                    <ListItemText
                      primary="Biography"
                      secondary={selectedMember.biography || 'N/A'}
                    />
                  </ListItem>
                </List>
              </TabPanel>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Member Status</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusForm.status}
                onChange={(e) => setStatusForm(prev => ({ ...prev, status: e.target.value as any }))}
                label="Status"
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={statusForm.isTemporaryMember || false}
                  onChange={(e) => setStatusForm(prev => ({ ...prev, isTemporaryMember: e.target.checked }))}
                />
              }
              label="Temporary Member"
            />
            <TextField
              fullWidth
              label="User ID (optional)"
              value={statusForm.userId || ''}
              onChange={(e) => setStatusForm(prev => ({ ...prev, userId: e.target.value }))}
              placeholder="Leave empty if not applicable"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleStatusSubmit} variant="contained">Update Status</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminFamilyMembers; 
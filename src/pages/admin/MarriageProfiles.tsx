import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider,
} from '@mui/material';
import { Visibility as VisibilityIcon, Edit as EditIcon } from '@mui/icons-material';
import {
  getMarriageProfiles,
  getMarriageProfileById,
  updateMarriageProfileStatus,
  searchMarriageProfiles,
  MarriageProfileFilters,
} from '../../services/adminService';

const AdminMarriageProfiles: React.FC = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [filters, setFilters] = useState<MarriageProfileFilters>({
    page: 1,
    limit: 10,
  });
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [ageRange, setAgeRange] = useState<number[]>([18, 60]);

  useEffect(() => {
    fetchProfiles();
  }, [filters]);

  const fetchProfiles = async () => {
    try {
      const response = await getMarriageProfiles(filters);
      setProfiles(response.data?.profiles || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      setProfiles([]);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await searchMarriageProfiles({
        ...filters,
        minAge: ageRange[0],
        maxAge: ageRange[1],
      });
      setProfiles(response.data?.profiles || []);
    } catch (error) {
      console.error('Error searching profiles:', error);
      setProfiles([]);
    }
  };

  const handleViewDetails = async (id: string) => {
    try {
      const response = await getMarriageProfileById(id);
      setSelectedProfile(response.data);
      setDetailsDialogOpen(true);
    } catch (error) {
      console.error('Error fetching profile details:', error);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedProfile) return;

    try {
      await updateMarriageProfileStatus(selectedProfile.id, {
        status: newStatus,
      });
      setStatusDialogOpen(false);
      fetchProfiles();
    } catch (error) {
      console.error('Error updating profile status:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Marriage Profiles
      </Typography>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={filters.gender || ''}
                  onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Marital Status</InputLabel>
                <Select
                  value={filters.maritalStatus || ''}
                  onChange={(e) => setFilters({ ...filters, maritalStatus: e.target.value })}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="single">Single</MenuItem>
                  <MenuItem value="divorced">Divorced</MenuItem>
                  <MenuItem value="widowed">Widowed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Religion</InputLabel>
                <Select
                  value={filters.religion || ''}
                  onChange={(e) => setFilters({ ...filters, religion: e.target.value })}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="islam">Islam</MenuItem>
                  <MenuItem value="christianity">Christianity</MenuItem>
                  <MenuItem value="hinduism">Hinduism</MenuItem>
                  <MenuItem value="buddhism">Buddhism</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="City"
                value={filters.city || ''}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom>Age Range</Typography>
              <Slider
                value={ageRange}
                onChange={(_, newValue) => setAgeRange(newValue as number[])}
                valueLabelDisplay="auto"
                min={18}
                max={60}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={handleSearch} fullWidth>
                Search
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Profiles Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {profiles.map((profile) => (
              <TableRow key={profile.id}>
                <TableCell>{profile.name}</TableCell>
                <TableCell>{profile.age}</TableCell>
                <TableCell>{profile.gender}</TableCell>
                <TableCell>{profile.city}</TableCell>
                <TableCell>
                  <Chip
                    label={profile.status}
                    color={
                      profile.status === 'approved'
                        ? 'success'
                        : profile.status === 'pending'
                        ? 'warning'
                        : 'error'
                    }
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleViewDetails(profile.id)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setSelectedProfile(profile);
                      setStatusDialogOpen(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Profile Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Profile Details</DialogTitle>
        <DialogContent>
          {selectedProfile && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">Personal Information</Typography>
                <Typography>Name: {selectedProfile.name}</Typography>
                <Typography>Age: {selectedProfile.age}</Typography>
                <Typography>Gender: {selectedProfile.gender}</Typography>
                <Typography>Marital Status: {selectedProfile.maritalStatus}</Typography>
                <Typography>Religion: {selectedProfile.religion}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Contact Information</Typography>
                <Typography>Email: {selectedProfile.email}</Typography>
                <Typography>Phone: {selectedProfile.phone}</Typography>
                <Typography>City: {selectedProfile.city}</Typography>
                <Typography>Country: {selectedProfile.country}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Education & Career</Typography>
                <Typography>Education: {selectedProfile.education}</Typography>
                <Typography>Occupation: {selectedProfile.occupation}</Typography>
                <Typography>Income: {selectedProfile.income}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Preferences</Typography>
                <Typography>Partner Age Range: {selectedProfile.preferredAgeRange}</Typography>
                <Typography>Partner Location: {selectedProfile.preferredLocation}</Typography>
                <Typography>Partner Education: {selectedProfile.preferredEducation}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)}>
        <DialogTitle>Update Profile Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>New Status</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateStatus} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminMarriageProfiles; 
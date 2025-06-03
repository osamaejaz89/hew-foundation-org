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
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Visibility as VisibilityIcon, Edit as EditIcon } from '@mui/icons-material';
import {
  getJobApplications,
  getJobApplicationDetails,
  updateJobApplicationStatus,
  JobApplicationFilters,
} from '../../services/adminService';

const AdminJobApplications: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [filters, setFilters] = useState<JobApplicationFilters>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchApplications();
  }, [filters]);

  const fetchApplications = async () => {
    try {
      const response = await getJobApplications(filters);
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleViewDetails = async (id: string) => {
    try {
      const response = await getJobApplicationDetails(id);
      setSelectedApplication(response.data);
      setDetailsDialogOpen(true);
    } catch (error) {
      console.error('Error fetching application details:', error);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedApplication) return;

    try {
      await updateJobApplicationStatus(selectedApplication.id, {
        status: newStatus,
        feedback,
      });
      setStatusDialogOpen(false);
      fetchApplications();
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Job Applications
      </Typography>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status || ''}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="shortlisted">Shortlisted</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                  <MenuItem value="hired">Hired</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Job ID"
                value={filters.jobId || ''}
                onChange={(e) => setFilters({ ...filters, jobId: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Applicant ID"
                value={filters.applicantId || ''}
                onChange={(e) => setFilters({ ...filters, applicantId: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={filters.createdAtStart ? new Date(filters.createdAtStart) : null}
                  onChange={(date) => setFilters({ ...filters, createdAtStart: date?.toISOString() })}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Applicant</TableCell>
              <TableCell>Job Title</TableCell>
              <TableCell>Applied Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map((application) => (
              <TableRow key={application.id}>
                <TableCell>{application.applicantName}</TableCell>
                <TableCell>{application.jobTitle}</TableCell>
                <TableCell>{new Date(application.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip
                    label={application.status}
                    color={
                      application.status === 'hired'
                        ? 'success'
                        : application.status === 'shortlisted'
                        ? 'primary'
                        : application.status === 'pending'
                        ? 'warning'
                        : 'error'
                    }
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleViewDetails(application.id)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setSelectedApplication(application);
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

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)}>
        <DialogTitle>Update Application Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>New Status</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="shortlisted">Shortlisted</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
              <MenuItem value="hired">Hired</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Feedback"
            multiline
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleStatusUpdate} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Application Details</DialogTitle>
        <DialogContent>
          {selectedApplication && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">Personal Information</Typography>
                <Typography>Name: {selectedApplication.applicantName}</Typography>
                <Typography>Email: {selectedApplication.applicantEmail}</Typography>
                <Typography>Phone: {selectedApplication.applicantPhone}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Job Information</Typography>
                <Typography>Position: {selectedApplication.jobTitle}</Typography>
                <Typography>Company: {selectedApplication.companyName}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Application Details</Typography>
                <Typography>Cover Letter: {selectedApplication.coverLetter}</Typography>
                <Typography>Resume: {selectedApplication.resumeUrl}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminJobApplications; 
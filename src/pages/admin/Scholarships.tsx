import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  Switch,
  FormControlLabel,
  Tooltip,
  Divider,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Add as AddIcon, Edit as EditIcon, Info as InfoIcon } from '@mui/icons-material';
import {
  createScholarship,
  updateScholarship,
  getScholarshipApplications,
  updateScholarshipApplicationStatus,
  getScholarshipStatistics,
} from '../../services/adminService';

interface Scholarship {
  _id: string;
  title: string;
  description: string;
  eligibility: string;
  coverage: string;
  deadline: string;
  amount: number;
  requirements: string[];
  status: string;
  maxApplicants: number;
  currentApplicants: number;
  isActive: boolean;
  metadata: {
    duration: string;
    renewable: boolean;
    minimumGPA: number;
    programs: string[];
    semesters: string[];
    priorityDeadline: string;
  };
}

interface ApiResponse {
  scholarships: Scholarship[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

const AdminScholarships: React.FC = () => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eligibility: '',
    coverage: '',
    amount: '',
    status: 'Open',
    requirements: [] as string[],
    deadline: null as Date | null,
    maxApplicants: 15,
    isActive: true,
    metadata: {
      duration: '',
      renewable: false,
      minimumGPA: 0,
      programs: [] as string[],
      semesters: [] as string[],
      priorityDeadline: '',
    },
  });

  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://localhost:3000/api/scholarships',
        headers: { 
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFraWYuYWJkdWxsYWguYWEzMkBnbWFpbC5jb20iLCJ0eXBlIjoidXNlciIsImlhdCI6MTc0NzgyOTY2NSwiZXhwIjoxNzc5Mzg3MjY1LCJhdWQiOiI2NzZhZWUzNzJiMTc2YWMwYjY0NDc5YzciLCJpc3MiOiJoZXcifQ.nu-SG_Zig7jlh7ERSTKcndr9b_us1Pgtfq7leNmTTTM'
        }
      };

      const response = await axios.request<ApiResponse>(config);
      setScholarships(response.data.scholarships || []);
      
      // For now, we'll keep the applications and statistics as empty arrays/null
      // since we don't have those endpoints yet
      setApplications([]);
      setStatistics(null);
    } catch (error) {
      console.error('Error fetching scholarships:', error);
      setError('Failed to fetch scholarships. Please try again later.');
      setScholarships([]);
      setApplications([]);
      setStatistics(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateScholarship = async () => {
    try {
      await createScholarship({
        ...formData,
        amount: Number(formData.amount),
        deadline: formData.deadline?.toISOString() || '',
        metadata: {
          ...formData.metadata,
          priorityDeadline: formData.metadata.priorityDeadline ? new Date(formData.metadata.priorityDeadline).toISOString() : '',
        }
      });
      setCreateDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error creating scholarship:', error);
    }
  };

  const handleUpdateScholarship = async () => {
    if (!selectedScholarship) return;

    try {
      await updateScholarship(selectedScholarship._id, {
        ...formData,
        amount: Number(formData.amount),
        deadline: formData.deadline?.toISOString() || '',
        metadata: {
          ...formData.metadata,
          priorityDeadline: formData.metadata.priorityDeadline ? new Date(formData.metadata.priorityDeadline).toISOString() : '',
        }
      });
      setEditDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error updating scholarship:', error);
    }
  };

  const handleUpdateApplicationStatus = async () => {
    if (!selectedApplication) return;

    try {
      await updateScholarshipApplicationStatus(selectedApplication.id, {
        status: newStatus,
      });
      setStatusDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'success';
      case 'draft':
        return 'warning';
      case 'closed':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Scholarships</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Create Scholarship
        </Button>
      </Box>

      {error && (
        <Box sx={{ mb: 3 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Scholarships
              </Typography>
              <Typography variant="h5">{scholarships.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Scholarships
              </Typography>
              <Typography variant="h5">
                {scholarships.filter(s => s.isActive).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Applicants
              </Typography>
              <Typography variant="h5">
                {scholarships.reduce((sum, s) => sum + s.currentApplicants, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Open Scholarships
              </Typography>
              <Typography variant="h5">
                {scholarships.filter(s => s.status === 'Open').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Scholarships Table */}
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        {loading ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography>Loading scholarships...</Typography>
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Deadline</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Applicants</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scholarships.map((scholarship) => (
                <TableRow key={scholarship._id}>
                  <TableCell>{scholarship.title}</TableCell>
                  <TableCell>{scholarship.amount}</TableCell>
                  <TableCell>{formatDate(scholarship.deadline)}</TableCell>
                  <TableCell>
                    <Chip
                      label={scholarship.status}
                      color={getStatusColor(scholarship.status)}
                    />
                  </TableCell>
                  <TableCell>
                    {scholarship.currentApplicants}/{scholarship.maxApplicants}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton
                        onClick={() => {
                          setSelectedScholarship(scholarship);
                          setDetailsDialogOpen(true);
                        }}
                      >
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={() => {
                          setSelectedScholarship(scholarship);
                          setFormData({
                            title: scholarship.title,
                            description: scholarship.description,
                            eligibility: scholarship.eligibility,
                            coverage: scholarship.coverage,
                            amount: scholarship.amount.toString(),
                            status: scholarship.status,
                            requirements: scholarship.requirements,
                            deadline: new Date(scholarship.deadline),
                            maxApplicants: scholarship.maxApplicants,
                            isActive: scholarship.isActive,
                            metadata: scholarship.metadata,
                          });
                          setEditDialogOpen(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Applications Table */}
      <Typography variant="h5" gutterBottom>
        Applications
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Applicant</TableCell>
              <TableCell>Scholarship</TableCell>
              <TableCell>Applied Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map((application) => (
              <TableRow key={application.id}>
                <TableCell>{application.applicantName}</TableCell>
                <TableCell>{application.scholarshipTitle}</TableCell>
                <TableCell>{new Date(application.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip
                    label={application.status}
                    color={
                      application.status === 'approved'
                        ? 'success'
                        : application.status === 'pending'
                        ? 'warning'
                        : 'error'
                    }
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setSelectedApplication(application);
                      setStatusDialogOpen(true);
                    }}
                  >
                    Update Status
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Scholarship Details Dialog */}
      <Dialog open={detailsDialogOpen} onClose={() => setDetailsDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Scholarship Details</DialogTitle>
        <DialogContent>
          {selectedScholarship && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>{selectedScholarship.title}</Typography>
              <Typography color="textSecondary" gutterBottom>{selectedScholarship.status}</Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>Description</Typography>
              <Typography paragraph>{selectedScholarship.description}</Typography>
              
              <Typography variant="subtitle1" gutterBottom>Eligibility</Typography>
              <Typography paragraph>{selectedScholarship.eligibility}</Typography>
              
              <Typography variant="subtitle1" gutterBottom>Coverage</Typography>
              <Typography paragraph>{selectedScholarship.coverage}</Typography>
              
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Amount</Typography>
                  <Typography>{selectedScholarship.amount}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Deadline</Typography>
                  <Typography>{formatDate(selectedScholarship.deadline)}</Typography>
                </Grid>
              </Grid>
              
              <Typography variant="subtitle1" sx={{ mt: 2 }} gutterBottom>Requirements</Typography>
              <Box sx={{ mb: 2 }}>
                {selectedScholarship.requirements.map((req, index) => (
                  <Chip
                    key={index}
                    label={req}
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
              
              <Typography variant="subtitle1" gutterBottom>Additional Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">Duration: {selectedScholarship.metadata.duration}</Typography>
                  <Typography variant="body2">Renewable: {selectedScholarship.metadata.renewable ? 'Yes' : 'No'}</Typography>
                  <Typography variant="body2">Minimum GPA: {selectedScholarship.metadata.minimumGPA}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">Priority Deadline: {formatDate(selectedScholarship.metadata.priorityDeadline)}</Typography>
                </Grid>
              </Grid>
              
              <Typography variant="subtitle1" sx={{ mt: 2 }} gutterBottom>Eligible Programs</Typography>
              <Box sx={{ mb: 2 }}>
                {selectedScholarship.metadata.programs.map((program, index) => (
                  <Chip
                    key={index}
                    label={program}
                    variant="outlined"
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
              
              <Typography variant="subtitle1" gutterBottom>Available Semesters</Typography>
              <Box>
                {selectedScholarship.metadata.semesters.map((semester, index) => (
                  <Chip
                    key={index}
                    label={semester}
                    variant="outlined"
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Create/Edit Scholarship Dialog */}
      <Dialog open={createDialogOpen || editDialogOpen} onClose={() => {
        setCreateDialogOpen(false);
        setEditDialogOpen(false);
      }} maxWidth="md" fullWidth>
        <DialogTitle>{createDialogOpen ? 'Create Scholarship' : 'Edit Scholarship'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Eligibility"
                multiline
                rows={2}
                value={formData.eligibility}
                onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Coverage"
                multiline
                rows={2}
                value={formData.coverage}
                onChange={(e) => setFormData({ ...formData, coverage: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Max Applicants"
                type="number"
                value={formData.maxApplicants}
                onChange={(e) => setFormData({ ...formData, maxApplicants: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration"
                value={formData.metadata.duration}
                onChange={(e) => setFormData({
                  ...formData,
                  metadata: { ...formData.metadata, duration: e.target.value }
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Minimum GPA"
                type="number"
                value={formData.metadata.minimumGPA}
                onChange={(e) => setFormData({
                  ...formData,
                  metadata: { ...formData.metadata, minimumGPA: Number(e.target.value) }
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Deadline"
                  value={formData.deadline}
                  onChange={(date) => setFormData({ ...formData, deadline: date })}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Priority Deadline"
                  value={formData.metadata.priorityDeadline ? new Date(formData.metadata.priorityDeadline) : null}
                  onChange={(date) => setFormData({
                    ...formData,
                    metadata: { ...formData.metadata, priorityDeadline: date?.toISOString() || '' }
                  })}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Programs</InputLabel>
                <Select
                  multiple
                  value={formData.metadata.programs}
                  onChange={(e) => setFormData({
                    ...formData,
                    metadata: { ...formData.metadata, programs: e.target.value as string[] }
                  })}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem value="Computer Science">Computer Science</MenuItem>
                  <MenuItem value="Software Engineering">Software Engineering</MenuItem>
                  <MenuItem value="Data Science">Data Science</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Semesters</InputLabel>
                <Select
                  multiple
                  value={formData.metadata.semesters}
                  onChange={(e) => setFormData({
                    ...formData,
                    metadata: { ...formData.metadata, semesters: e.target.value as string[] }
                  })}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem value="Fall 2024">Fall 2024</MenuItem>
                  <MenuItem value="Spring 2025">Spring 2025</MenuItem>
                  <MenuItem value="Fall 2025">Fall 2025</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.metadata.renewable}
                    onChange={(e) => setFormData({
                      ...formData,
                      metadata: { ...formData.metadata, renewable: e.target.checked }
                    })}
                  />
                }
                label="Renewable"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setCreateDialogOpen(false);
            setEditDialogOpen(false);
          }}>Cancel</Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={createDialogOpen ? handleCreateScholarship : handleUpdateScholarship}
          >
            {createDialogOpen ? 'Create' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Application Status Dialog */}
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
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateApplicationStatus} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminScholarships; 
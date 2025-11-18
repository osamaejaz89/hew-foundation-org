import React, { useState, useEffect, useCallback } from "react";
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
  TablePagination,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert,
  CircularProgress,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import {
  getJobApplications,
  getJobApplicationDetails,
  updateJobApplicationStatus,
  JobApplicationFilters,
  JobApplication,
} from "../../services/adminService";

const AdminJobApplications: React.FC = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [filters, setFilters] = useState<JobApplicationFilters>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [selectedApplication, setSelectedApplication] =
    useState<JobApplication | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [feedback, setFeedback] = useState("");
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getJobApplications(filters);
      console.log("Applications:", response.data);
      setApplications(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Error fetching applications:", error);
      setError(error instanceof Error ? error.message : 'Failed to fetch applications');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleViewDetails = async (id: string) => {
    try {
      setDetailsLoading(true);
      setError(null);
      const application = await getJobApplicationDetails(id);
      console.log("Application details:", application);
      console.log("Resume URL:", application.resumeUrl);
      setSelectedApplication(application);
      setDetailsDialogOpen(true);
    } catch (error) {
      console.error("Error fetching application details:", error);
      setError(error instanceof Error ? error.message : 'Failed to fetch application details');
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedApplication) return;

    try {
      setLoading(true);
      setError(null);
      await updateJobApplicationStatus(selectedApplication._id, {
        status: newStatus,
        feedback,
      });
      setStatusDialogOpen(false);
      await fetchApplications();
    } catch (error) {
      console.error("Error updating application status:", error);
      setError(error instanceof Error ? error.message : 'Failed to update application status');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    setFilters({ ...filters, page: newPage + 1 });
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFilters({
      ...filters,
      page: 1,
      limit: parseInt(event.target.value, 10),
    });
  };

  const renderApplicationDetails = () => {
    if (!selectedApplication) return null;

    return (
      <Grid container spacing={3}>
        {/* Personal Information */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Personal Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Name:</strong> {selectedApplication.applicantName || 'N/A'}
              </Typography>
              <Typography>
                <strong>Email:</strong> {selectedApplication.email || 'N/A'}
              </Typography>
              <Typography>
                <strong>Phone:</strong> {selectedApplication.phone || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Current Company:</strong>{" "}
                {selectedApplication.currentCompany || "N/A"}
              </Typography>
              <Typography>
                <strong>Current Position:</strong>{" "}
                {selectedApplication.currentPosition || "N/A"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        {/* Education */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Education
          </Typography>
          {selectedApplication.education ? (
            <>
              <Typography>
                <strong>Degree:</strong>{" "}
                {selectedApplication.education.degree || 'N/A'}
              </Typography>
              <Typography>
                <strong>Field:</strong> {selectedApplication.education.field || 'N/A'}
              </Typography>
              <Typography>
                <strong>Institution:</strong>{" "}
                {selectedApplication.education.institution || 'N/A'}
              </Typography>
              <Typography>
                <strong>Graduation Year:</strong>{" "}
                {selectedApplication.education.graduationYear || 'N/A'}
              </Typography>
            </>
          ) : (
            <Typography>No education information available</Typography>
          )}
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        {/* Experience */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Experience
          </Typography>
          {selectedApplication.experience ? (
            <Typography>
              {selectedApplication.experience.years || 0} years{" "}
              {selectedApplication.experience.months || 0} months
            </Typography>
          ) : (
            <Typography>No experience information available</Typography>
          )}
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        {/* Job Information */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Job Information
          </Typography>
          {selectedApplication.jobId ? (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Position:</strong>{" "}
                  {selectedApplication.jobId.title || 'N/A'}
                </Typography>
                <Typography>
                  <strong>Company:</strong>{" "}
                  {selectedApplication.jobId.company?.name || 'N/A'}
                </Typography>
                <Typography>
                  <strong>Type:</strong> {selectedApplication.jobId.type || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Location:</strong>{" "}
                  {selectedApplication.jobId.location?.isRemote
                    ? "Remote"
                    : selectedApplication.jobId.location
                    ? `${selectedApplication.jobId.location.city || 'N/A'}, ${selectedApplication.jobId.location.country || 'N/A'}`
                    : 'N/A'}
                </Typography>
                <Typography>
                  <strong>Salary:</strong>{" "}
                  {selectedApplication.jobId.salary
                    ? `${selectedApplication.jobId.salary.min || 0} - ${selectedApplication.jobId.salary.max || 0} ${selectedApplication.jobId.salary.currency || ''} (${selectedApplication.jobId.salary.period || ''})`
                    : 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          ) : (
            <Typography>No job information available</Typography>
          )}
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        {/* Application Details */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Application Details
          </Typography>
          <Typography>
            <strong>Cover Letter:</strong>
          </Typography>
          <Typography paragraph>
            {selectedApplication.coverLetter || "No cover letter provided"}
          </Typography>
          <Typography>
            <strong>Resume:</strong>{" "}
            {selectedApplication.resumeUrl ? (
              <Button
                href={selectedApplication.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                size="small"
                sx={{ ml: 1 }}
              >
                View Resume
              </Button>
            ) : (
              "No resume available"
            )}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        {/* Status History */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Status History
          </Typography>
          {selectedApplication.statusHistory?.length > 0 ? (
            <List>
              {selectedApplication.statusHistory.map((status) => (
                <ListItem key={status._id}>
                  <ListItemText
                    primary={status.status}
                    secondary={`${new Date(
                      status.date
                    ).toLocaleString()} - ${status.note || 'No note'}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No status history available</Typography>
          )}
        </Grid>
      </Grid>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Job Applications
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
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
                value={filters.jobId || ""}
                onChange={(e) =>
                  setFilters({ ...filters, jobId: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Applicant ID"
                value={filters.applicantId || ""}
                onChange={(e) =>
                  setFilters({ ...filters, applicantId: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={
                    filters.createdAtStart
                      ? new Date(filters.createdAtStart)
                      : null
                  }
                  onChange={(date) =>
                    setFilters({
                      ...filters,
                      createdAtStart: date?.toISOString(),
                    })
                  }
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <TableContainer component={Paper}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Applicant</TableCell>
                <TableCell>Job Title</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Experience</TableCell>
                <TableCell>Applied Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((application) => (
                console.log("Application:", application),
                <TableRow key={application._id}>
                  <TableCell>{application.applicantName}</TableCell>
                  <TableCell>{application.jobId?.title || 'N/A'}</TableCell>
                  <TableCell>{application.jobId?.company?.name || 'N/A'}</TableCell>
                  <TableCell>
                    {application.jobId?.location?.isRemote
                      ? "Remote"
                      : application.jobId?.location
                      ? `${application.jobId.location.city || 'N/A'}, ${application.jobId.location.country || 'N/A'}`
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {application.experience
                      ? `${application.experience.years || 0} years ${application.experience.months || 0} months`
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {application.createdAt
                      ? new Date(application.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={application.status || 'pending'}
                      color={
                        application.status === "hired"
                          ? "success"
                          : application.status === "shortlisted"
                          ? "primary"
                          : application.status === "pending"
                          ? "warning"
                          : "error"
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleViewDetails(application.jobId?._id)}
                      disabled={loading}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setSelectedApplication(application);
                        setStatusDialogOpen(true);
                      }}
                      disabled={loading}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <TablePagination
          component="div"
          count={pagination.total}
          page={pagination.page - 1}
          onPageChange={handlePageChange}
          rowsPerPage={filters.limit || 10}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </TableContainer>

      {/* Status Update Dialog */}
      <Dialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
      >
        <DialogTitle>Update Application Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>New Status</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              disabled={loading}
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
            disabled={loading}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleStatusUpdate}
            variant="contained"
            color="primary"
            disabled={loading || !newStatus}
          >
            {loading ? <CircularProgress size={24} /> : 'Update'}
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
          {detailsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            renderApplicationDetails()
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

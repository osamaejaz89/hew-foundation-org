import React, { useState, useEffect } from "react";
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
  Avatar,
  FormHelperText,
  Stack,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import {
  getJobs,
  updateJobStatus,
  toggleJobFeature,
  createJob,
  JobFilters,
  Job,
  JOB_STATUS,
  JOB_TYPES,
  SALARY_PERIODS,
  CURRENCIES,
  EXPERIENCE_UNITS
} from "../../services/adminService";
import { useNavigate } from "react-router-dom";

interface CreateJobFormData {
  title: string;
  company: {
    name: string;
    logo: string;
    website: string;
    size: string;
    industry: string;
  };
  location: {
    city: string;
    country: string;
    isRemote: boolean;
    address: string;
  };
  type: string;
  education: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  skills: string[];
  experience: {
    min: number;
    max: number;
    unit: string;
  };
  salary: {
    min: number;
    max: number;
    currency: string;
    period: string;
    isNegotiable: boolean;
  };
  benefits: Array<{
    title: string;
    description: string;
  }>;
  postedDate: string;
  deadline: string;
  status: string;
  metadata: {
    isUrgent: boolean;
    isFeatured: boolean;
    tags: string[];
  };
}

const AdminJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filters, setFilters] = useState<JobFilters>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newJob, setNewJob] = useState<CreateJobFormData>({
    title: "",
    company: {
      name: "",
      logo: "",
      website: "",
      size: "",
      industry: "",
    },
    location: {
      city: "",
      country: "",
      isRemote: false,
      address: "",
    },
    type: "",
    education: "",
    description: "",
    requirements: [""],
    responsibilities: [""],
    skills: [""],
    experience: {
      min: 0,
      max: 0,
      unit: "years",
    },
    salary: {
      min: 0,
      max: 0,
      currency: "USD",
      period: "yearly",
      isNegotiable: false,
    },
    benefits: [
      {
        title: "",
        description: "",
      },
    ],
    postedDate: new Date().toISOString(),
    deadline: "",
    status: "active",
    metadata: {
      isUrgent: false,
      isFeatured: false,
      tags: [],
    },
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    try {
      const response = await getJobs(filters);
      setJobs(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedJob) return;

    try {
      await updateJobStatus(
        selectedJob._id,
        newStatus,
        newStatus === "rejected" ? rejectionReason : undefined
      );
      setStatusDialogOpen(false);
      fetchJobs();
    } catch (error) {
      console.error("Error updating job status:", error);
    }
  };

  const handleToggleFeature = async (
    jobId: string,
    currentFeatured: boolean
  ) => {
    try {
      await toggleJobFeature(jobId, { isFeatured: !currentFeatured });
      fetchJobs();
    } catch (error) {
      console.error("Error toggling job feature:", error);
    }
  };

  const handleCreateJob = async () => {
    try {
      await createJob(newJob);
      setCreateDialogOpen(false);
      fetchJobs();
      // Reset form
      setNewJob({
        title: "",
        company: {
          name: "",
          logo: "",
          website: "",
          size: "",
          industry: "",
        },
        location: {
          city: "",
          country: "",
          isRemote: false,
          address: "",
        },
        type: "",
        education: "",
        description: "",
        requirements: [""],
        responsibilities: [""],
        skills: [""],
        experience: {
          min: 0,
          max: 0,
          unit: "years",
        },
        salary: {
          min: 0,
          max: 0,
          currency: "USD",
          period: "yearly",
          isNegotiable: false,
        },
        benefits: [
          {
            title: "",
            description: "",
          },
        ],
        postedDate: new Date().toISOString(),
        deadline: "",
        status: "active",
        metadata: {
          isUrgent: false,
          isFeatured: false,
          tags: [],
        },
      });
    } catch (error) {
      console.error("Error creating job:", error);
    }
  };

  const handleAddField = (field: "requirements" | "responsibilities" | "skills") => {
    setNewJob((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const handleRemoveField = (
    field: "requirements" | "responsibilities" | "skills",
    index: number
  ) => {
    setNewJob((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleFieldChange = (
    field: "requirements" | "responsibilities" | "skills",
    index: number,
    value: string
  ) => {
    setNewJob((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const handleAddBenefit = () => {
    setNewJob((prev) => ({
      ...prev,
      benefits: [...prev.benefits, { title: "", description: "" }],
    }));
  };

  const handleRemoveBenefit = (index: number) => {
    setNewJob((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }));
  };

  const handleBenefitChange = (index: number, field: "title" | "description", value: string) => {
    setNewJob((prev) => ({
      ...prev,
      benefits: prev.benefits.map((benefit, i) =>
        i === index ? { ...benefit, [field]: value } : benefit
      ),
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{
            py: 1.5,
            px: 3,
            fontSize: '1.1rem',
            fontWeight: 'bold',
            boxShadow: 3,
            '&:hover': {
              boxShadow: 6,
              transform: 'translateY(-2px)',
              transition: 'all 0.2s ease-in-out'
            }
          }}
        >
          Create New Job
        </Button>
        <Typography variant="h4">Admin Jobs</Typography>
      </Box>

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
                  {Object.entries(JOB_STATUS).map(([key, value]) => (
                    <MenuItem key={value} value={value}>
                      {key.charAt(0) + key.slice(1).toLowerCase()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={filters.type || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, type: e.target.value })
                  }
                >
                  <MenuItem value="">All</MenuItem>
                  {Object.entries(JOB_TYPES).map(([key, value]) => (
                    <MenuItem key={value} value={value}>
                      {key.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Location"
                value={filters.location || ""}
                onChange={(e) =>
                  setFilters({ ...filters, location: e.target.value })
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

      {/* Jobs Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Company</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Applications</TableCell>
              <TableCell>Featured</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs?.map((job) => (
              <TableRow key={job._id}>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar src={job.company.logo} alt={job.company.name} />
                    {job.company.name}
                  </Box>
                </TableCell>
                <TableCell>{job.title}</TableCell>
                <TableCell>
                  {job.location.city}, {job.location.country}
                  {job.location.isRemote && (
                    <Chip
                      label="Remote"
                      size="small"
                      color="primary"
                      sx={{ ml: 1 }}
                    />
                  )}
                </TableCell>
                <TableCell>{job.type}</TableCell>
                <TableCell>
                  <Chip
                    label={job.status}
                    color={
                      job.status === "active"
                        ? "success"
                        : job.status === "pending"
                        ? "warning"
                        : "error"
                    }
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="body2">
                      Total: {job.applications.total}
                    </Typography>
                    <Typography variant="body2">
                      Viewed: {job.applications.viewed}
                    </Typography>
                    <Typography variant="body2">
                      Shortlisted: {job.applications.shortlisted}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() =>
                      handleToggleFeature(job._id, job.metadata.isFeatured)
                    }
                    color={job.metadata.isFeatured ? "primary" : "default"}
                  >
                    <StarIcon />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => navigate(`/jobs/edit/${job._id}`)}
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
      <Dialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
      >
        <DialogTitle>Update Job Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>New Status</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
            </Select>
          </FormControl>
          {newStatus === "rejected" && (
            <TextField
              fullWidth
              label="Rejection Reason"
              multiline
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              sx={{ mt: 2 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleStatusUpdate}
            variant="contained"
            color="primary"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Job Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Job</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Job Title"
                value={newJob.title}
                onChange={(e) =>
                  setNewJob((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </Grid>

            {/* Company Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Company Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company Name"
                value={newJob.company.name}
                onChange={(e) =>
                  setNewJob((prev) => ({
                    ...prev,
                    company: { ...prev.company, name: e.target.value },
                  }))
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company Logo URL"
                value={newJob.company.logo}
                onChange={(e) =>
                  setNewJob((prev) => ({
                    ...prev,
                    company: { ...prev.company, logo: e.target.value },
                  }))
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company Website"
                value={newJob.company.website}
                onChange={(e) =>
                  setNewJob((prev) => ({
                    ...prev,
                    company: { ...prev.company, website: e.target.value },
                  }))
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company Size"
                value={newJob.company.size}
                onChange={(e) =>
                  setNewJob((prev) => ({
                    ...prev,
                    company: { ...prev.company, size: e.target.value },
                  }))
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Industry"
                value={newJob.company.industry}
                onChange={(e) =>
                  setNewJob((prev) => ({
                    ...prev,
                    company: { ...prev.company, industry: e.target.value },
                  }))
                }
              />
            </Grid>

            {/* Location Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Location Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                value={newJob.location.city}
                onChange={(e) =>
                  setNewJob((prev) => ({
                    ...prev,
                    location: { ...prev.location, city: e.target.value },
                  }))
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Country"
                value={newJob.location.country}
                onChange={(e) =>
                  setNewJob((prev) => ({
                    ...prev,
                    location: { ...prev.location, country: e.target.value },
                  }))
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={newJob.location.address}
                onChange={(e) =>
                  setNewJob((prev) => ({
                    ...prev,
                    location: { ...prev.location, address: e.target.value },
                  }))
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl>
                <FormHelperText>Remote Work</FormHelperText>
                <Select
                  value={newJob.location.isRemote ? "yes" : "no"}
                  onChange={(e) =>
                    setNewJob((prev) => ({
                      ...prev,
                      location: {
                        ...prev.location,
                        isRemote: e.target.value === "yes",
                      },
                    }))
                  }
                >
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Job Details */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Job Details
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Job Type</InputLabel>
                <Select
                  value={newJob.type}
                  onChange={(e) =>
                    setNewJob((prev) => ({ ...prev, type: e.target.value }))
                  }
                >
                  <MenuItem value="Full-time">Full Time</MenuItem>
                  <MenuItem value="Part-time">Part Time</MenuItem>
                  <MenuItem value="Contract">Contract</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Education"
                value={newJob.education}
                onChange={(e) =>
                  setNewJob((prev) => ({ ...prev, education: e.target.value }))
                }
              />
            </Grid>

            {/* Experience */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Min Experience"
                value={newJob.experience.min}
                onChange={(e) =>
                  setNewJob((prev) => ({
                    ...prev,
                    experience: {
                      ...prev.experience,
                      min: parseInt(e.target.value),
                    },
                  }))
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Max Experience"
                value={newJob.experience.max}
                onChange={(e) =>
                  setNewJob((prev) => ({
                    ...prev,
                    experience: {
                      ...prev.experience,
                      max: parseInt(e.target.value),
                    },
                  }))
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Unit</InputLabel>
                <Select
                  value={newJob.experience.unit}
                  onChange={(e) =>
                    setNewJob((prev) => ({
                      ...prev,
                      experience: {
                        ...prev.experience,
                        unit: e.target.value,
                      },
                    }))
                  }
                >
                  <MenuItem value="years">Years</MenuItem>
                  <MenuItem value="months">Months</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Salary */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Min Salary"
                value={newJob.salary.min}
                onChange={(e) =>
                  setNewJob((prev) => ({
                    ...prev,
                    salary: {
                      ...prev.salary,
                      min: parseInt(e.target.value),
                    },
                  }))
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Max Salary"
                value={newJob.salary.max}
                onChange={(e) =>
                  setNewJob((prev) => ({
                    ...prev,
                    salary: {
                      ...prev.salary,
                      max: parseInt(e.target.value),
                    },
                  }))
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Currency</InputLabel>
                <Select
                  value={newJob.salary.currency}
                  onChange={(e) =>
                    setNewJob((prev) => ({
                      ...prev,
                      salary: {
                        ...prev.salary,
                        currency: e.target.value,
                      },
                    }))
                  }
                >
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="PKR">PKR</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Period</InputLabel>
                <Select
                  value={newJob.salary.period}
                  onChange={(e) =>
                    setNewJob((prev) => ({
                      ...prev,
                      salary: {
                        ...prev.salary,
                        period: e.target.value,
                      },
                    }))
                  }
                >
                  <MenuItem value="yearly">Yearly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="hourly">Hourly</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl>
                <FormHelperText>Negotiable</FormHelperText>
                <Select
                  value={newJob.salary.isNegotiable ? "yes" : "no"}
                  onChange={(e) =>
                    setNewJob((prev) => ({
                      ...prev,
                      salary: {
                        ...prev.salary,
                        isNegotiable: e.target.value === "yes",
                      },
                    }))
                  }
                >
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Job Description"
                value={newJob.description}
                onChange={(e) =>
                  setNewJob((prev) => ({ ...prev, description: e.target.value }))
                }
              />
            </Grid>

            {/* Requirements */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Requirements
              </Typography>
              <Stack spacing={2}>
                {newJob.requirements.map((req, index) => (
                  <Box key={index} sx={{ display: "flex", gap: 1 }}>
                    <TextField
                      fullWidth
                      value={req}
                      onChange={(e) =>
                        handleFieldChange("requirements", index, e.target.value)
                      }
                    />
                    <IconButton
                      onClick={() => handleRemoveField("requirements", index)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  variant="outlined"
                  onClick={() => handleAddField("requirements")}
                >
                  Add Requirement
                </Button>
              </Stack>
            </Grid>

            {/* Responsibilities */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Responsibilities
              </Typography>
              <Stack spacing={2}>
                {newJob.responsibilities.map((resp, index) => (
                  <Box key={index} sx={{ display: "flex", gap: 1 }}>
                    <TextField
                      fullWidth
                      value={resp}
                      onChange={(e) =>
                        handleFieldChange("responsibilities", index, e.target.value)
                      }
                    />
                    <IconButton
                      onClick={() => handleRemoveField("responsibilities", index)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  variant="outlined"
                  onClick={() => handleAddField("responsibilities")}
                >
                  Add Responsibility
                </Button>
              </Stack>
            </Grid>

            {/* Skills */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Skills
              </Typography>
              <Stack spacing={2}>
                {newJob.skills.map((skill, index) => (
                  <Box key={index} sx={{ display: "flex", gap: 1 }}>
                    <TextField
                      fullWidth
                      value={skill}
                      onChange={(e) =>
                        handleFieldChange("skills", index, e.target.value)
                      }
                    />
                    <IconButton
                      onClick={() => handleRemoveField("skills", index)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
                <Button variant="outlined" onClick={() => handleAddField("skills")}>
                  Add Skill
                </Button>
              </Stack>
            </Grid>

            {/* Benefits */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Benefits
              </Typography>
              <Stack spacing={2}>
                {newJob.benefits.map((benefit, index) => (
                  <Box key={index} sx={{ display: "flex", gap: 1 }}>
                    <TextField
                      fullWidth
                      label="Benefit Title"
                      value={benefit.title}
                      onChange={(e) => handleBenefitChange(index, "title", e.target.value)}
                    />
                    <TextField
                      fullWidth
                      label="Benefit Description"
                      value={benefit.description}
                      onChange={(e) => handleBenefitChange(index, "description", e.target.value)}
                    />
                    <IconButton
                      onClick={() => handleRemoveBenefit(index)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  variant="outlined"
                  onClick={handleAddBenefit}
                >
                  Add Benefit
                </Button>
              </Stack>
            </Grid>

            {/* Deadline */}
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Application Deadline"
                  value={newJob.deadline ? new Date(newJob.deadline) : null}
                  onChange={(date) =>
                    setNewJob((prev) => ({
                      ...prev,
                      deadline: date?.toISOString() || "",
                    }))
                  }
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>

            {/* Metadata */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Metadata
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl>
                    <FormHelperText>Urgent Position</FormHelperText>
                    <Select
                      value={newJob.metadata.isUrgent ? "yes" : "no"}
                      onChange={(e) =>
                        setNewJob((prev) => ({
                          ...prev,
                          metadata: {
                            ...prev.metadata,
                            isUrgent: e.target.value === "yes",
                          },
                        }))
                      }
                    >
                      <MenuItem value="yes">Yes</MenuItem>
                      <MenuItem value="no">No</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl>
                    <FormHelperText>Featured Job</FormHelperText>
                    <Select
                      value={newJob.metadata.isFeatured ? "yes" : "no"}
                      onChange={(e) =>
                        setNewJob((prev) => ({
                          ...prev,
                          metadata: {
                            ...prev.metadata,
                            isFeatured: e.target.value === "yes",
                          },
                        }))
                      }
                    >
                      <MenuItem value="yes">Yes</MenuItem>
                      <MenuItem value="no">No</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tags (comma-separated)"
                    value={newJob.metadata.tags.join(", ")}
                    onChange={(e) =>
                      setNewJob((prev) => ({
                        ...prev,
                        metadata: {
                          ...prev.metadata,
                          tags: e.target.value.split(",").map((tag) => tag.trim()),
                        },
                      }))
                    }
                    helperText="Enter tags separated by commas"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateJob} variant="contained" color="primary">
            Create Job
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminJobs;

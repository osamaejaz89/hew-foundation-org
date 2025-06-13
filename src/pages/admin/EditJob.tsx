import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Button,
  FormHelperText,
  Stack,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { 
  getJobById, 
  updateJob, 
  updateJobStatus,
  Job,
  JOB_STATUS,
  JOB_TYPES,
  SALARY_PERIODS,
  CURRENCIES,
  EXPERIENCE_UNITS
} from "../../services/adminService";

const EditJob: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await getJobById(id!);
      if (response.data?.data) {
        setJob(response.data.data);
      } else {
        setError("Job not found");
      }
    } catch (error) {
      console.error("Error fetching job:", error);
      setError("Failed to fetch job details");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;

    try {
      // First update the job details
      await updateJob(job._id, job);
      
      // Then update the status if it has changed
      if (job.status) {
        await updateJobStatus(job._id, job.status, job.rejectionReason);
      }
      
      navigate("/jobs");
    } catch (error) {
      console.error("Error updating job:", error);
      setError("Failed to update job");
    }
  };

  const handleAddField = (field: "requirements" | "responsibilities" | "skills") => {
    if (!job) return;
    setJob({
      ...job,
      [field]: [...job[field], ""],
    });
  };

  const handleRemoveField = (
    field: "requirements" | "responsibilities" | "skills",
    index: number
  ) => {
    if (!job) return;
    setJob({
      ...job,
      [field]: job[field].filter((_, i) => i !== index),
    });
  };

  const handleFieldChange = (
    field: "requirements" | "responsibilities" | "skills",
    index: number,
    value: string
  ) => {
    if (!job) return;
    setJob({
      ...job,
      [field]: job[field].map((item, i) => (i === index ? value : item)),
    });
  };

  const handleAddBenefit = () => {
    if (!job) return;
    setJob({
      ...job,
      benefits: [...job.benefits, { title: "", description: "" }],
    });
  };

  const handleRemoveBenefit = (index: number) => {
    if (!job) return;
    setJob({
      ...job,
      benefits: job.benefits.filter((_, i) => i !== index),
    });
  };

  const handleBenefitChange = (index: number, field: "title" | "description", value: string) => {
    if (!job) return;
    setJob({
      ...job,
      benefits: job.benefits.map((benefit, i) =>
        i === index ? { ...benefit, [field]: value } : benefit
      ),
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !job) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error">{error || "Job not found"}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Edit Job
      </Typography>

      <form onSubmit={handleSubmit}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Job Title"
                  value={job.title}
                  onChange={(e) =>
                    setJob({ ...job, title: e.target.value })
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
                  value={job.company.name}
                  onChange={(e) =>
                    setJob({
                      ...job,
                      company: { ...job.company, name: e.target.value },
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company Logo URL"
                  value={job.company.logo}
                  onChange={(e) =>
                    setJob({
                      ...job,
                      company: { ...job.company, logo: e.target.value },
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company Website"
                  value={job.company.website}
                  onChange={(e) =>
                    setJob({
                      ...job,
                      company: { ...job.company, website: e.target.value },
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company Size"
                  value={job.company.size}
                  onChange={(e) =>
                    setJob({
                      ...job,
                      company: { ...job.company, size: e.target.value },
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Industry"
                  value={job.company.industry}
                  onChange={(e) =>
                    setJob({
                      ...job,
                      company: { ...job.company, industry: e.target.value },
                    })
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
                  value={job.location.city}
                  onChange={(e) =>
                    setJob({
                      ...job,
                      location: { ...job.location, city: e.target.value },
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Country"
                  value={job.location.country}
                  onChange={(e) =>
                    setJob({
                      ...job,
                      location: { ...job.location, country: e.target.value },
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={job.location.address}
                  onChange={(e) =>
                    setJob({
                      ...job,
                      location: { ...job.location, address: e.target.value },
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl>
                  <FormHelperText>Remote Work</FormHelperText>
                  <Select
                    value={job.location.isRemote ? "yes" : "no"}
                    onChange={(e) =>
                      setJob({
                        ...job,
                        location: {
                          ...job.location,
                          isRemote: e.target.value === "yes",
                        },
                      })
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
                    value={job.type}
                    onChange={(e) =>
                      setJob({ ...job, type: e.target.value })
                    }
                  >
                    {Object.entries(JOB_TYPES).map(([key, value]) => (
                      <MenuItem key={value} value={value}>
                        {key.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Education"
                  value={job.education}
                  onChange={(e) =>
                    setJob({ ...job, education: e.target.value })
                  }
                />
              </Grid>

              {/* Experience */}
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Min Experience"
                  value={job.experience.min}
                  onChange={(e) =>
                    setJob({
                      ...job,
                      experience: {
                        ...job.experience,
                        min: parseInt(e.target.value),
                      },
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Max Experience"
                  value={job.experience.max}
                  onChange={(e) =>
                    setJob({
                      ...job,
                      experience: {
                        ...job.experience,
                        max: parseInt(e.target.value),
                      },
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Unit</InputLabel>
                  <Select
                    value={job.experience.unit}
                    onChange={(e) =>
                      setJob({
                        ...job,
                        experience: {
                          ...job.experience,
                          unit: e.target.value,
                        },
                      })
                    }
                  >
                    {Object.entries(EXPERIENCE_UNITS).map(([key, value]) => (
                      <MenuItem key={value} value={value}>
                        {key.charAt(0) + key.slice(1).toLowerCase()}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Salary */}
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Min Salary"
                  value={job.salary.min}
                  onChange={(e) =>
                    setJob({
                      ...job,
                      salary: {
                        ...job.salary,
                        min: parseInt(e.target.value),
                      },
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Max Salary"
                  value={job.salary.max}
                  onChange={(e) =>
                    setJob({
                      ...job,
                      salary: {
                        ...job.salary,
                        max: parseInt(e.target.value),
                      },
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Currency</InputLabel>
                  <Select
                    value={job.salary.currency}
                    onChange={(e) =>
                      setJob({
                        ...job,
                        salary: {
                          ...job.salary,
                          currency: e.target.value,
                        },
                      })
                    }
                  >
                    {Object.entries(CURRENCIES).map(([key, value]) => (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Period</InputLabel>
                  <Select
                    value={job.salary.period}
                    onChange={(e) =>
                      setJob({
                        ...job,
                        salary: {
                          ...job.salary,
                          period: e.target.value,
                        },
                      })
                    }
                  >
                    {Object.entries(SALARY_PERIODS).map(([key, value]) => (
                      <MenuItem key={value} value={value}>
                        {key.charAt(0) + key.slice(1).toLowerCase()}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl>
                  <FormHelperText>Negotiable</FormHelperText>
                  <Select
                    value={job.salary.isNegotiable ? "yes" : "no"}
                    onChange={(e) =>
                      setJob({
                        ...job,
                        salary: {
                          ...job.salary,
                          isNegotiable: e.target.value === "yes",
                        },
                      })
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
                  value={job.description}
                  onChange={(e) =>
                    setJob({ ...job, description: e.target.value })
                  }
                />
              </Grid>

              {/* Requirements */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Requirements
                </Typography>
                <Stack spacing={2}>
                  {job.requirements.map((req, index) => (
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
                  {job.responsibilities.map((resp, index) => (
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
                  {job.skills.map((skill, index) => (
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
                  {job.benefits.map((benefit, index) => (
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
                    value={job.deadline ? new Date(job.deadline) : null}
                    onChange={(date) =>
                      setJob({
                        ...job,
                        deadline: date?.toISOString() || "",
                      })
                    }
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </LocalizationProvider>
              </Grid>

              {/* Status */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Status
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Job Status</InputLabel>
                      <Select
                        value={job.status}
                        onChange={(e) =>
                          setJob({ ...job, status: e.target.value })
                        }
                      >
                        {Object.entries(JOB_STATUS).map(([key, value]) => (
                          <MenuItem key={value} value={value}>
                            {key.charAt(0) + key.slice(1).toLowerCase()}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  {job.status === "rejected" && (
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Rejection Reason"
                        value={job.rejectionReason || ""}
                        onChange={(e) =>
                          setJob({ ...job, rejectionReason: e.target.value })
                        }
                        helperText="Required when status is rejected"
                      />
                    </Grid>
                  )}
                </Grid>
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
                        value={job.metadata.isUrgent ? "yes" : "no"}
                        onChange={(e) =>
                          setJob({
                            ...job,
                            metadata: {
                              ...job.metadata,
                              isUrgent: e.target.value === "yes",
                            },
                          })
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
                        value={job.metadata.isFeatured ? "yes" : "no"}
                        onChange={(e) =>
                          setJob({
                            ...job,
                            metadata: {
                              ...job.metadata,
                              isFeatured: e.target.value === "yes",
                            },
                          })
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
                      value={job.metadata.tags.join(", ")}
                      onChange={(e) =>
                        setJob({
                          ...job,
                          metadata: {
                            ...job.metadata,
                            tags: e.target.value.split(",").map((tag) => tag.trim()),
                          },
                        })
                      }
                      helperText="Enter tags separated by commas"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            onClick={() => navigate("/jobs")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            Update Job
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditJob; 
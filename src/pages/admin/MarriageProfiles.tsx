import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Pagination,
  CircularProgress,
  Alert,
  Stack,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  Paper,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import {
  getMarriageProfiles,
  getMarriageProfileById,
  updateMarriageProfileStatus,
  MarriageProfileFilters,
} from "../../services/adminService";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DataTable from "../../components/dataTable/DataTable";
import { GridColDef } from "@mui/x-data-grid";
import { env } from "../../config/env.config";

const DEFAULT_AVATAR = "/public/noavatar.png";

const getProfileImageUrl = (profilePicture: string | undefined): string => {
  if (!profilePicture) return DEFAULT_AVATAR;
  if (profilePicture.startsWith("http://") || profilePicture.startsWith("https://")) return profilePicture;
  const base = (env.API_URL || "").replace(/\/$/, "");
  return `${base}/${profilePicture.replace(/^\//, "")}`;
};

const AdminMarriageProfiles: React.FC = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [filters, setFilters] = useState<MarriageProfileFilters>({
    page: 1,
    limit: 10,
  });
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState<
    "name" | "email" | "cnic" | "city"
  >("name");

  useEffect(() => {
    fetchProfiles();
    // eslint-disable-next-line
  }, [filters]);

  const fetchProfiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMarriageProfiles(filters);
      console.log(response.data.data);
      setProfiles(response.data?.data || []);
      setPagination(
        response.data?.pagination || { total: 0, page: 1, pages: 1 }
      );
    } catch (err: any) {
      setError("Failed to fetch profiles. Please try again.");
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMarriageProfileById(id);
      setSelectedProfile(response.data?.data);
      setDetailsDialogOpen(true);
    } catch (err: any) {
      setError("Failed to fetch profile details.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (_: any, value: number) => {
    setFilters((prev) => ({ ...prev, page: value }));
  };

  const handleApprove = async (profileId: string) => {
    try {
      setLoading(true);
      await updateMarriageProfileStatus(profileId, { status: "approved" });
      fetchProfiles();
    } catch (err) {
      setError("Failed to approve profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (profileId: string) => {
    try {
      setLoading(true);
      await updateMarriageProfileStatus(profileId, { status: "rejected" });
      fetchProfiles();
    } catch (err) {
      setError("Failed to reject profile.");
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({ page: 1, limit: 10 });
    setSearch("");
    setSearchField("name");
  };

  const totalProfiles = profiles.length;
  const pendingCount = profiles.filter((p) => p.status === "pending").length;
  const approvedCount = profiles.filter((p) => p.status === "approved").length;
  const rejectedCount = profiles.filter((p) => p.status === "rejected").length;

  const exportCSV = () => {
    if (!profiles.length) return;
    const headers = [
      "Full Name",
      "Gender",
      "City",
      "Country",
      "Date of Birth",
      "Marital Status",
      "Religion",
      "CNIC",
      "Email",
      "Phone",
      "Status",
      "Is Active",
    ];
    const rows = profiles.map((p) => [
      p.fullName,
      p.gender,
      p.city,
      p.country,
      p.dateOfBirth,
      p.maritalStatus,
      p.religion,
      p.cnic,
      p.email,
      p.phone,
      p.status,
      p.isActive ? "Active" : "Inactive",
    ]);
    const csvContent = [headers, ...rows]
      .map((r) => r.map((x) => `"${x ?? ""}"`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "marriage_profiles.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // DataTable columns
  const columns: GridColDef[] = [
    {
      field: "profilePicture",
      headerName: "Photo",
      width: 70,
      renderCell: (params) => (
        <Avatar
          src={getProfileImageUrl(params.row.profilePicture)}
          alt={params.row.fullName}
          sx={{ width: 40, height: 40 }}
        />
      ),
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "fullName",
      headerName: "Name",
      width: 160,
      renderCell: (params) => (
        <Typography fontWeight={500}>{params.row.fullName}</Typography>
      ),
    },
    {
      field: "gender",
      headerName: "Gender",
      width: 90,
      renderCell: (params) => (
        <Chip
          label={params.row.gender}
          size="small"
          color={
            params.row.gender === "male"
              ? "primary"
              : params.row.gender === "female"
              ? "secondary"
              : "default"
          }
        />
      ),
    },
    {
      field: "age",
      headerName: "Age",
      width: 80,
      valueGetter: (params) =>
        params.row.dateOfBirth
          ? new Date().getFullYear() -
            new Date(params.row.dateOfBirth).getFullYear()
          : "-",
    },
    {
      field: "city",
      headerName: "City",
      width: 120,
    },
    {
      field: "maritalStatus",
      headerName: "Marital Status",
      width: 120,
    },
    {
      field: "status",
      headerName: "Status",
      width: 110,
      renderCell: (params) => (
        <Chip
          label={params.row.status}
          size="small"
          color={
            params.row.status === "approved"
              ? "success"
              : params.row.status === "pending"
              ? "warning"
              : "error"
          }
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 140,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="View Details">
            <IconButton
              color="primary"
              onClick={() => handleViewDetails(params.row._id)}
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Approve">
            <span>
              <IconButton
                color="success"
                disabled={params.row.status === "approved"}
                onClick={() => handleApprove(params.row._id)}
              >
                <CheckIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Reject">
            <span>
              <IconButton
                color="error"
                disabled={params.row.status === "rejected"}
                onClick={() => handleReject(params.row._id)}
              >
                <CloseIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      <Typography variant="h4" gutterBottom>
        Marriage Profiles
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Professional summary and filter section */}
          <Box sx={{ mb: 4 }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3, bgcolor: '#f4f6f8' }}>
              {/* Summary Bar */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', letterSpacing: 1 }}>
                  Marriage Profile Summary
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<FileDownloadIcon />}
                  onClick={exportCSV}
                  sx={{ minWidth: 140, fontWeight: 600 }}
                >
                  Export CSV
                </Button>
              </Box>
              <Box sx={{ display: 'flex', gap: 3, mb: 2, flexWrap: 'wrap' }}>
                <Box sx={{ minWidth: 120, p: 2, bgcolor: '#fff', borderRadius: 2, boxShadow: 1, textAlign: 'center' }}>
                  <Typography variant="subtitle2" color="text.secondary">Total</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{totalProfiles}</Typography>
                </Box>
                <Box sx={{ minWidth: 120, p: 2, bgcolor: '#fff', borderRadius: 2, boxShadow: 1, textAlign: 'center' }}>
                  <Typography variant="subtitle2" color="warning.main">Pending</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'warning.main' }}>{pendingCount}</Typography>
                </Box>
                <Box sx={{ minWidth: 120, p: 2, bgcolor: '#fff', borderRadius: 2, boxShadow: 1, textAlign: 'center' }}>
                  <Typography variant="subtitle2" color="success.main">Approved</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>{approvedCount}</Typography>
                </Box>
                <Box sx={{ minWidth: 120, p: 2, bgcolor: '#fff', borderRadius: 2, boxShadow: 1, textAlign: 'center' }}>
                  <Typography variant="subtitle2" color="error.main">Rejected</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'error.main' }}>{rejectedCount}</Typography>
                </Box>
              </Box>
              {/* Filter Form */}
              <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', mt: 2, bgcolor: '#f8f9fa', p: 2, borderRadius: 2, boxShadow: 0 }} onSubmit={e => { e.preventDefault(); setFilters(f => ({ ...f, page: 1, [searchField]: search || undefined })); }}>
                <FormControl size="small" sx={{ minWidth: 130 }}>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    value={filters.gender || ""}
                    label="Gender"
                    onChange={e => setFilters(f => ({ ...f, gender: e.target.value || undefined, page: 1 }))}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="City"
                  size="small"
                  sx={{ minWidth: 130 }}
                  value={filters.city || ""}
                  onChange={e => setFilters(f => ({ ...f, city: e.target.value || undefined, page: 1 }))}
                />
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Marital Status</InputLabel>
                  <Select
                    value={filters.maritalStatus || ""}
                    label="Marital Status"
                    onChange={e => setFilters(f => ({ ...f, maritalStatus: e.target.value || undefined, page: 1 }))}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="single">Single</MenuItem>
                    <MenuItem value="married">Married</MenuItem>
                    <MenuItem value="divorced">Divorced</MenuItem>
                    <MenuItem value="widowed">Widowed</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Religion"
                  size="small"
                  sx={{ minWidth: 130 }}
                  value={filters.religion || ""}
                  onChange={e => setFilters(f => ({ ...f, religion: e.target.value || undefined, page: 1 }))}
                />
                <TextField
                  label="Min Age"
                  size="small"
                  type="number"
                  sx={{ minWidth: 90 }}
                  value={filters.minAge || ""}
                  onChange={e => setFilters(f => ({ ...f, minAge: e.target.value ? Number(e.target.value) : undefined, page: 1 }))}
                  inputProps={{ min: 0 }}
                />
                <TextField
                  label="Max Age"
                  size="small"
                  type="number"
                  sx={{ minWidth: 90 }}
                  value={filters.maxAge || ""}
                  onChange={e => setFilters(f => ({ ...f, maxAge: e.target.value ? Number(e.target.value) : undefined, page: 1 }))}
                  inputProps={{ min: 0 }}
                />
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Search By</InputLabel>
                  <Select
                    value={searchField}
                    label="Search By"
                    onChange={e => setSearchField(e.target.value as any)}
                  >
                    <MenuItem value="name">Name</MenuItem>
                    <MenuItem value="email">Email</MenuItem>
                    <MenuItem value="cnic">CNIC</MenuItem>
                    <MenuItem value="city">City</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label={`Search ${searchField.charAt(0).toUpperCase() + searchField.slice(1)}`}
                  size="small"
                  sx={{ minWidth: 150 }}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      setFilters(f => ({ ...f, page: 1, [searchField]: search || undefined }));
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() => setFilters(f => ({ ...f, page: 1, [searchField]: search || undefined }))}
                      >
                        <SearchIcon />
                      </IconButton>
                    ),
                  }}
                />
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={clearFilters}
                  sx={{ minWidth: 90, fontWeight: 600 }}
                >
                  Clear
                </Button>
              </Box>
            </Paper>
          </Box>
          <DataTable
            columns={columns}
            rows={profiles}
            slug="marriage-profiles"
            handleDeleteApi={async () => {}}
            handleEdit={() => {}}
            loading={loading}
            getRowId={(row) => row._id}
          />
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={pagination.pages}
              page={pagination.page}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
              showFirstButton
              showLastButton
            />
          </Box>
        </>
      )}
      {/* Profile Details Modal */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2, bgcolor: "#fff" } }}
      >
        <DialogTitle
          sx={{
            borderBottom: "1px solid #e0e0e0",
            m: 0,
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            Profile Details
          </Typography>
          <IconButton onClick={() => setDetailsDialogOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedProfile && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Avatar
                    src={getProfileImageUrl(selectedProfile.profilePicture)}
                    alt={selectedProfile.fullName}
                    sx={{ width: 100, height: 100, mb: 2 }}
                  />
                  <Typography variant="h5" fontWeight={600}>
                    {selectedProfile.fullName}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {selectedProfile.gender} | {selectedProfile.city} |{" "}
                    {selectedProfile.country}
                  </Typography>
                  <Chip
                    label={selectedProfile.isActive ? "Active" : "Inactive"}
                    color={selectedProfile.isActive ? "success" : "error"}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={8}>
                <Box sx={{ bgcolor: "#f8f9fa", p: 2, borderRadius: 1, mb: 2 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    color="primary"
                    mb={1}
                  >
                    Personal Information
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <b>Date of Birth:</b>{" "}
                      {selectedProfile.dateOfBirth
                        ? new Date(
                            selectedProfile.dateOfBirth
                          ).toLocaleDateString()
                        : "-"}
                    </Grid>
                    <Grid item xs={6}>
                      <b>Marital Status:</b> {selectedProfile.maritalStatus}
                    </Grid>
                    <Grid item xs={6}>
                      <b>Religion:</b> {selectedProfile.religion}
                    </Grid>
                    <Grid item xs={6}>
                      <b>Sect:</b> {selectedProfile.sect}
                    </Grid>
                    <Grid item xs={6}>
                      <b>Mother Tongue:</b> {selectedProfile.motherTongue}
                    </Grid>
                    <Grid item xs={6}>
                      <b>CNIC:</b> {selectedProfile.cnic}
                    </Grid>
                    <Grid item xs={6}>
                      <b>Physical Appearance:</b>{" "}
                      {selectedProfile.physicalAppearance}
                    </Grid>
                    <Grid item xs={6}>
                      <b>Height:</b> {selectedProfile.height}
                    </Grid>
                    <Grid item xs={6}>
                      <b>Weight:</b> {selectedProfile.weight}
                    </Grid>
                  </Grid>
                </Box>
                <Box sx={{ bgcolor: "#f8f9fa", p: 2, borderRadius: 1, mb: 2 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    color="primary"
                    mb={1}
                  >
                    Contact
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <b>Email:</b> {selectedProfile.email}
                    </Grid>
                    <Grid item xs={6}>
                      <b>Phone:</b> {selectedProfile.phone}
                    </Grid>
                    <Grid item xs={6}>
                      <b>City:</b> {selectedProfile.city}
                    </Grid>
                    <Grid item xs={6}>
                      <b>Country:</b> {selectedProfile.country}
                    </Grid>
                  </Grid>
                </Box>
                <Box sx={{ bgcolor: "#f8f9fa", p: 2, borderRadius: 1, mb: 2 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    color="primary"
                    mb={1}
                  >
                    Education & Career
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <b>Education:</b> {selectedProfile.education}
                    </Grid>
                    <Grid item xs={6}>
                      <b>Profession:</b> {selectedProfile.profession}
                    </Grid>
                    <Grid item xs={6}>
                      <b>Income:</b> {selectedProfile.income}
                    </Grid>
                  </Grid>
                </Box>
                <Box sx={{ bgcolor: "#f8f9fa", p: 2, borderRadius: 1, mb: 2 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    color="primary"
                    mb={1}
                  >
                    Family Details
                  </Typography>
                  {selectedProfile.familyDetails ? (
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <b>Father Name:</b>{" "}
                        {selectedProfile.familyDetails.fatherName}
                      </Grid>
                      <Grid item xs={6}>
                        <b>Mother Name:</b>{" "}
                        {selectedProfile.familyDetails.motherName}
                      </Grid>
                      <Grid item xs={6}>
                        <b>Siblings:</b>{" "}
                        {selectedProfile.familyDetails.siblings}
                      </Grid>
                      <Grid item xs={6}>
                        <b>Family Status:</b>{" "}
                        {selectedProfile.familyDetails.familyStatus}
                      </Grid>
                      <Grid item xs={6}>
                        <b>Family Profession:</b>{" "}
                        {selectedProfile.familyDetails.familyProfession}
                      </Grid>
                    </Grid>
                  ) : (
                    <Typography color="text.secondary">
                      No family details provided.
                    </Typography>
                  )}
                </Box>
                <Box sx={{ bgcolor: "#f8f9fa", p: 2, borderRadius: 1 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    color="primary"
                    mb={1}
                  >
                    Preferences
                  </Typography>
                  {selectedProfile.preferences ? (
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <b>Age Range:</b>{" "}
                        {selectedProfile.preferences.ageRange
                          ? `${selectedProfile.preferences.ageRange.min} - ${selectedProfile.preferences.ageRange.max}`
                          : "-"}
                      </Grid>
                      <Grid item xs={6}>
                        <b>Marital Status:</b>{" "}
                        {selectedProfile.preferences.maritalStatus?.join(", ")}
                      </Grid>
                      <Grid item xs={6}>
                        <b>Height Preference:</b>{" "}
                        {selectedProfile.preferences.heightPreference}
                      </Grid>
                      <Grid item xs={6}>
                        <b>City Preference:</b>{" "}
                        {selectedProfile.preferences.cityPreference}
                      </Grid>
                      <Grid item xs={6}>
                        <b>Religion Preference:</b>{" "}
                        {selectedProfile.preferences.religionPreference}
                      </Grid>
                    </Grid>
                  ) : (
                    <Typography color="text.secondary">
                      No preferences provided.
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckIcon />}
            onClick={() => handleApprove(selectedProfile._id)}
            disabled={selectedProfile?.status === "approved" || loading}
          >
            Approve
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<CloseIcon />}
            onClick={() => handleReject(selectedProfile._id)}
            disabled={selectedProfile?.status === "rejected" || loading}
          >
            Reject
          </Button>
          <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminMarriageProfiles;

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Pagination,
  Tabs,
  Tab,
  Paper,
  InputAdornment,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
  Alert,
  Skeleton,
} from "@mui/material";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { Family, FamilyMember } from "../../types/family";
import { familyService } from "../../services/familyService";
import { toast } from "react-toastify";

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
      id={`search-tabpanel-${index}`}
      aria-labelledby={`search-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminFamilySearch: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    families: Family[];
    members: FamilyMember[];
  }>({
    families: [],
    members: [],
  });
  const [totalResults, setTotalResults] = useState({ families: 0, members: 0 });

  // Family search filters
  const [familyFilters, setFamilyFilters] = useState({
    search: "",
    page: 1,
    limit: 10,
  });

  // Member search filters
  const [memberFilters, setMemberFilters] = useState({
    search: "",
    gender: "",
    relationshipType: "",
    status: "",
    page: 1,
    limit: 10,
  });

  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    Family | FamilyMember | null
  >(null);

  const handleFamilySearch = async () => {
    if (!familyFilters.search.trim()) {
      toast.warning("Please enter a search term");
      return;
    }

    setLoading(true);
    try {
      const response = await familyService.searchFamilies(familyFilters);
      setSearchResults((prev) => ({ ...prev, families: response.data }));
      setTotalResults((prev) => ({ ...prev, families: response.total }));
    } catch (error) {
      console.error("Error searching families:", error);
      toast.error("Failed to search families");
    } finally {
      setLoading(false);
    }
  };

  const handleMemberSearch = async () => {
    if (!memberFilters.search.trim()) {
      toast.warning("Please enter a search term");
      return;
    }

    setLoading(true);
    try {
      const response = await familyService.searchFamilyMembers(memberFilters);
      setSearchResults((prev) => ({ ...prev, members: response.data }));
      setTotalResults((prev) => ({ ...prev, members: response.total }));
    } catch (error) {
      console.error("Error searching members:", error);
      toast.error("Failed to search members");
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setFamilyFilters({
      search: "",
      page: 1,
      limit: 10,
    });
    setMemberFilters({
      search: "",
      gender: "",
      relationshipType: "",
      status: "",
      page: 1,
      limit: 10,
    });
    setSearchResults({ families: [], members: [] });
    setTotalResults({ families: 0, members: 0 });
  };

  const handleViewItem = (item: Family | FamilyMember) => {
    setSelectedItem(item);
    setViewDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  const getGenderColor = (gender: string) => {
    switch (gender) {
      case "male":
        return "primary";
      case "female":
        return "secondary";
      default:
        return "default";
    }
  };

  const getAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const renderFamilyResults = () => (
    <Box>
      {searchResults.families.length === 0 && !loading ? (
        <Alert severity="info">
          No families found. Try adjusting your search criteria.
        </Alert>
      ) : (
        <List>
          {searchResults.families.map((family, index) => (
            <React.Fragment key={family.id}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    <PeopleIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="h6" fontWeight="bold">
                        {family.name}
                      </Typography>
                      <Chip
                        label={family.familyCode}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {family.description}
                      </Typography>
                      <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                        <Chip
                          icon={<PeopleIcon />}
                          label={`${family.memberCount || 0} members`}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          label={family.isActive ? "Active" : "Inactive"}
                          color={family.isActive ? "success" : "error"}
                          size="small"
                        />
                        <Typography variant="caption" color="text.secondary">
                          Created:{" "}
                          {new Date(family.createdAt).toLocaleDateString()}
                        </Typography>
                      </Stack>
                    </Box>
                  }
                />
                <Stack direction="row" spacing={1}>
                  <Tooltip title="View Details">
                    <IconButton onClick={() => handleViewItem(family)}>
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Family">
                    <IconButton>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Family">
                    <IconButton color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </ListItem>
              {index < searchResults.families.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      )}

      {totalResults.families > 0 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={Math.ceil(totalResults.families / familyFilters.limit)}
            page={familyFilters.page}
            onChange={(_, page) =>
              setFamilyFilters((prev) => ({ ...prev, page }))
            }
            color="primary"
          />
        </Box>
      )}
    </Box>
  );

  const renderMemberResults = () => (
    <Box>
      {searchResults.members.length === 0 && !loading ? (
        <Alert severity="info">
          No members found. Try adjusting your search criteria.
        </Alert>
      ) : (
        <List>
          {searchResults.members.map((member, index) => (
            <React.Fragment key={member.id}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar src={member.profilePicture}>
                    {member.firstName.charAt(0)}
                    {member.lastName.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="h6" fontWeight="bold">
                        {member.firstName} {member.lastName}
                      </Typography>
                      <Chip
                        label={member.relationshipType}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {member.occupation || "No occupation"} •{" "}
                        {member.currentLocation || "No location"}
                      </Typography>
                      <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                        <Chip
                          label={member.gender}
                          color={getGenderColor(member.gender) as any}
                          size="small"
                        />
                        <Chip
                          label={`${getAge(member.dateOfBirth)} years`}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          label={member.status || "unknown"}
                          color={
                            getStatusColor(member.status || "unknown") as any
                          }
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
                        <Typography variant="caption" color="text.secondary">
                          Family: {member.familyCode || member.familyId}
                        </Typography>
                      </Stack>
                    </Box>
                  }
                />
                <Stack direction="row" spacing={1}>
                  <Tooltip title="View Details">
                    <IconButton onClick={() => handleViewItem(member)}>
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Member">
                    <IconButton>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Member">
                    <IconButton color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </ListItem>
              {index < searchResults.members.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      )}

      {totalResults.members > 0 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={Math.ceil(totalResults.members / memberFilters.limit)}
            page={memberFilters.page}
            onChange={(_, page) =>
              setMemberFilters((prev) => ({ ...prev, page }))
            }
            color="primary"
          />
        </Box>
      )}
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          Family Search
        </Typography>
        <Button
          variant="outlined"
          onClick={handleClearFilters}
          startIcon={<ClearIcon />}
        >
          Clear All
        </Button>
      </Box>

      {/* Search Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
        >
          <Tab label="Search Families" />
          <Tab label="Search Members" />
        </Tabs>
      </Paper>

      {/* Family Search */}
      <TabPanel value={tabValue} index={0}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Search Families
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  placeholder="Search by family name, code, or description..."
                  value={familyFilters.search}
                  onChange={(e) =>
                    setFamilyFilters((prev) => ({
                      ...prev,
                      search: e.target.value,
                    }))
                  }
                  onKeyPress={(e) => e.key === "Enter" && handleFamilySearch()}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    onClick={handleFamilySearch}
                    startIcon={<SearchIcon />}
                    disabled={loading}
                  >
                    Search
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() =>
                      setFamilyFilters((prev) => ({ ...prev, search: "" }))
                    }
                    startIcon={<ClearIcon />}
                  >
                    Clear
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Family Results */}
        <Card>
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6">
                Family Results ({totalResults.families})
              </Typography>
              {loading && <Skeleton width={100} />}
            </Box>
            {loading ? (
              <Box>
                {[1, 2, 3].map((i) => (
                  <Box key={i} sx={{ mb: 2 }}>
                    <Skeleton variant="rectangular" height={80} />
                  </Box>
                ))}
              </Box>
            ) : (
              renderFamilyResults()
            )}
          </CardContent>
        </Card>
      </TabPanel>

      {/* Member Search */}
      <TabPanel value={tabValue} index={1}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Search Members
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search by name, occupation, or location..."
                  value={memberFilters.search}
                  onChange={(e) =>
                    setMemberFilters((prev) => ({
                      ...prev,
                      search: e.target.value,
                    }))
                  }
                  onKeyPress={(e) => e.key === "Enter" && handleMemberSearch()}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    value={memberFilters.gender}
                    onChange={(e) =>
                      setMemberFilters((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }))
                    }
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
                  <InputLabel>Relationship</InputLabel>
                  <Select
                    value={memberFilters.relationshipType}
                    onChange={(e) =>
                      setMemberFilters((prev) => ({
                        ...prev,
                        relationshipType: e.target.value,
                      }))
                    }
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
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={memberFilters.status}
                    onChange={(e) =>
                      setMemberFilters((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
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
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    onClick={handleMemberSearch}
                    startIcon={<SearchIcon />}
                    disabled={loading}
                  >
                    Search
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() =>
                      setMemberFilters((prev) => ({
                        ...prev,
                        search: "",
                        gender: "",
                        relationshipType: "",
                        status: "",
                      }))
                    }
                    startIcon={<ClearIcon />}
                  >
                    Clear
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Member Results */}
        <Card>
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6">
                Member Results ({totalResults.members})
              </Typography>
              {loading && <Skeleton width={100} />}
            </Box>
            {loading ? (
              <Box>
                {[1, 2, 3].map((i) => (
                  <Box key={i} sx={{ mb: 2 }}>
                    <Skeleton variant="rectangular" height={100} />
                  </Box>
                ))}
              </Box>
            ) : (
              renderMemberResults()
            )}
          </CardContent>
        </Card>
      </TabPanel>

      {/* View Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedItem && "familyCode" in selectedItem
            ? "Family Details"
            : "Member Details"}
        </DialogTitle>
        <DialogContent>
          {selectedItem && (
            <Box>
              {"familyCode" in selectedItem ? (
                // Family details
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Family Code
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {selectedItem.familyCode}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Name
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {"familyCode" in selectedItem
                        ? (selectedItem as Family).name
                        : ""}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Description
                    </Typography>
                    <Typography variant="body1">
                      {(selectedItem as Family).description}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Member Count
                    </Typography>
                    <Typography variant="body1">
                      {(selectedItem as Family).memberCount || 0}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip
                      label={
                        (selectedItem as Family).isActive
                          ? "Active"
                          : "Inactive"
                      }
                      color={
                        (selectedItem as Family).isActive ? "success" : "error"
                      }
                      size="small"
                    />
                  </Grid>
                </Grid>
              ) : (
                // Member details
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                    >
                      <Avatar
                        src={selectedItem.profilePicture}
                        sx={{ width: 100, height: 100, mb: 2 }}
                      >
                        {selectedItem.firstName.charAt(0)}
                        {selectedItem.lastName.charAt(0)}
                      </Avatar>
                      <Typography variant="h6" fontWeight="bold">
                        {selectedItem.firstName} {selectedItem.lastName}
                      </Typography>
                      <Chip
                        label={selectedItem.relationshipType}
                        color="primary"
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Age
                        </Typography>
                        <Typography variant="body1">
                          {getAge(selectedItem.dateOfBirth)} years
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Gender
                        </Typography>
                        <Chip
                          label={selectedItem.gender}
                          color={getGenderColor(selectedItem.gender) as any}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Occupation
                        </Typography>
                        <Typography variant="body1">
                          {selectedItem.occupation || "N/A"}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Location
                        </Typography>
                        <Typography variant="body1">
                          {selectedItem.currentLocation || "N/A"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Biography
                        </Typography>
                        <Typography variant="body1">
                          {selectedItem.biography || "N/A"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminFamilySearch;

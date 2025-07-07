import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  People as PeopleIcon,
  PieChart as PieChartIcon,
  Refresh as RefreshIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
  MoreVert as MoreIcon,
  FamilyRestroom as FamilyIcon,
  Download as DownloadIcon,
  Analytics as AnalyticsIcon,
  Assessment as AssessmentIcon,
} from "@mui/icons-material";
import { FamilyStats, FamilyAnalytics } from "../../types/family";
import { familyService } from "../../services/familyService";
import { toast } from "react-toastify";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import {
  getFamilyStats,
  getFamilyAnalytics,
  getAllFamiliesWithStats,
  exportFamilyData
} from '../../services/adminService';
import { Family } from '../../types/family';

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

const AdminFamilyAnalytics: React.FC = () => {
  const [stats, setStats] = useState<FamilyStats | null>(null);
  const [analytics, setAnalytics] = useState<FamilyAnalytics | null>(null);
  const [recentFamilies, setRecentFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("month");

  useEffect(() => {
    loadDashboardData();
  }, [period]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, analyticsData, familiesData] = await Promise.all([
        getFamilyStats(),
        getFamilyAnalytics(period),
        getAllFamiliesWithStats({ page: 1, limit: 5, sortBy: 'createdAt', sortOrder: 'desc' })
      ]);

      setStats(statsData);
      setAnalytics(analyticsData);
      setRecentFamilies(familiesData.data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'json' | 'csv') => {
    try {
      const blob = await exportFamilyData({ format });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `family-analytics-${period}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success(`Export completed: family-analytics-${period}.${format}`);
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    }
  };

  const getGrowthIcon = (growthRate: number) => {
    return growthRate >= 0 ? (
      <TrendingUpIcon color="success" />
    ) : (
      <TrendingDownIcon color="error" />
    );
  };

  const getGrowthColor = (growthRate: number) => {
    return growthRate >= 0 ? "success" : "error";
  };

  const formatNumber = (num: number) => {
    if (typeof num !== 'number' || isNaN(num)) {
      return '0';
    }
    return new Intl.NumberFormat().format(num);
  };

  const formatPercentage = (num: number) => {
    if (typeof num !== 'number' || isNaN(num)) {
      return '+0.0%';
    }
    return `${num >= 0 ? "+" : ""}${num.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Family Analytics Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comprehensive overview of family heritage platform statistics and trends
          </Typography>
        </Box>
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
            startIcon={<RefreshIcon />}
            onClick={loadDashboardData}
          >
            Refresh
          </Button>
        </Stack>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Families
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {formatNumber(stats?.totalFamilies || 0)}
                  </Typography>
                  <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                    {stats?.activeFamilies || 0} active
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <FamilyIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Members
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {formatNumber(stats?.totalMembers || 0)}
                  </Typography>
                  <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                    {stats?.activeMembers || 0} active
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  <PeopleIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Avg Members/Family
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {typeof stats?.averageMembersPerFamily === 'number' 
                      ? stats.averageMembersPerFamily.toFixed(1) 
                      : "0.0"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    per family
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <AnalyticsIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Growth Rate
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color={getGrowthColor(analytics?.growthRate || 0)}>
                    {getGrowthIcon(analytics?.growthRate || 0)} {Math.abs(analytics?.growthRate || 0).toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    this {period}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <TrendingUpIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Analytics Overview */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Growth
              </Typography>
              {stats?.recentGrowth && (
                <Box>
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography variant="body2">Families</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      +{stats.recentGrowth.families}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(stats.recentGrowth.families / Math.max(stats.recentGrowth.families, 1)) * 100} 
                    sx={{ mb: 2 }}
                  />
                  
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography variant="body2">Members</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      +{stats.recentGrowth.members}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(stats.recentGrowth.members / Math.max(stats.recentGrowth.members, 1)) * 100} 
                    sx={{ mb: 2 }}
                  />
                  
                  <Typography variant="caption" color="text.secondary">
                    Period: {stats.recentGrowth.period}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Member Status Distribution
              </Typography>
              <Stack spacing={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">Active Members</Typography>
                  <Chip 
                    label={stats?.activeMembers || 0} 
                    color="success" 
                    size="small" 
                  />
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">Pending Members</Typography>
                  <Chip 
                    label={stats?.pendingMembers || 0} 
                    color="warning" 
                    size="small" 
                  />
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">Temporary Members</Typography>
                  <Chip 
                    label={stats?.temporaryMembers || 0} 
                    color="info" 
                    size="small" 
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Demographics */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Locations
              </Typography>
              {analytics?.topLocations && analytics.topLocations.length > 0 ? (
                <List>
                  {analytics.topLocations.slice(0, 5).map((location, index) => (
                  <ListItem key={index} dense>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                        <LocationIcon fontSize="small" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={location.location}
                      secondary={`${location.count} families`}
                    />
                    <Chip label={`#${index + 1}`} size="small" color="primary" />
                  </ListItem>
                ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No location data available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Gender Distribution
              </Typography>
              {analytics?.genderDistribution && analytics.genderDistribution.length > 0 ? (
                <List>
                  {analytics.genderDistribution.map((gender, index) => (
                  <ListItem key={index} dense>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: gender?.gender === 'male' ? 'primary.main' : 'secondary.main', width: 32, height: 32 }}>
                        <PeopleIcon fontSize="small" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={gender?.gender ? gender.gender.charAt(0).toUpperCase() + gender.gender.slice(1) : 'Unknown'}
                      secondary={`${gender?.count || 0} members`}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {((gender?.count || 0) / (analytics?.genderDistribution?.reduce((sum, g) => sum + (g?.count || 0), 0) || 1) * 100).toFixed(1)}%
                    </Typography>
                  </ListItem>
                ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No gender distribution data available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Families */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Families
          </Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'grey.50' }}>
                  <TableCell>Family Code</TableCell>
                  <TableCell>Owner</TableCell>
                  <TableCell>Members</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentFamilies.map((family) => (
                  <TableRow key={family._id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {family.familyCode}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {family.userId?.name || 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {family.userId?.email || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={family.members?.length || 0}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(family.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={family.isActive ? 'Active' : 'Inactive'}
                        color={family.isActive ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AdminFamilyAnalytics;

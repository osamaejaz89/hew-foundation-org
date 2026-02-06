import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { Family, FamilyMember, FamilyStats } from '../types/family';
import { familyService } from '../services/familyService';

// API may return populated refs as objects; ensure we render a string
const displayRef = (val: string | { _id?: string; familyCode?: string; name?: string; email?: string } | undefined): string => {
  if (val == null) return '—';
  if (typeof val === 'string') return val;
  return (val as any).familyCode ?? (val as any)._id ?? (val as any).name ?? (val as any).email ?? '—';
};

const FamilyManagement: React.FC = () => {
  const [families, setFamilies] = useState<Family[]>([]);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [stats, setStats] = useState<FamilyStats | null>(null);
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', description: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [familiesResponse, membersResponse, statsData] = await Promise.all([
        familyService.getAllFamilies(),
        familyService.getAllFamilyMembers(),
        familyService.getFamilyStats(),
      ]);
      setFamilies(familiesResponse?.data ?? []);
      setMembers(membersResponse?.data ?? []);
      setStats(statsData ?? null);
    } catch (error) {
      console.error('Error loading data:', error);
      setFamilies([]);
      setMembers([]);
    }
  };

  const handleEditClick = (family: Family) => {
    setSelectedFamily(family);
    setEditForm({ name: family.name || '', description: family.description || '' });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedFamily) return;
    try {
      await familyService.updateFamily(selectedFamily.familyCode, editForm);
      setEditDialogOpen(false);
      loadData();
    } catch (error) {
      console.error('Error updating family:', error);
    }
  };

  const handleDeleteFamily = async (familyCode: string) => {
    if (window.confirm('Are you sure you want to delete this family?')) {
      try {
        await familyService.deleteFamily(familyCode);
        loadData();
      } catch (error) {
        console.error('Error deleting family:', error);
      }
    }
  };

  const handleUpdateMemberStatus = async (memberId: string, newStatus: 'active' | 'inactive' | 'pending') => {
    try {
      await familyService.updateMemberStatus(memberId, { status: newStatus });
      loadData();
    } catch (error) {
      console.error('Error updating member status:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Families
              </Typography>
              <Typography variant="h4">{stats?.totalFamilies || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Families
              </Typography>
              <Typography variant="h4">{stats?.activeFamilies || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Members
              </Typography>
              <Typography variant="h4">{stats?.totalMembers || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Members
              </Typography>
              <Typography variant="h4">{stats?.activeMembers || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Families Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Families</Typography>
                <Button
                  startIcon={<RefreshIcon />}
                  onClick={loadData}
                  variant="outlined"
                >
                  Refresh
                </Button>
              </Box>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Code</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Created At</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(families ?? []).map((family) => (
                      <TableRow key={family.id ?? family._id ?? family.familyCode}>
                        <TableCell>{family.familyCode ?? displayRef(family as any)}</TableCell>
                        <TableCell>{typeof family.name === 'string' ? family.name : displayRef(family.userId)}</TableCell>
                        <TableCell>{typeof family.description === 'string' ? family.description : '—'}</TableCell>
                        <TableCell>{new Date(family.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleEditClick(family)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteFamily(family.familyCode)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Members Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>Family Members</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User ID</TableCell>
                      <TableCell>Family ID</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(members ?? []).map((member) => (
                      <TableRow key={member.id ?? member._id}>
                        <TableCell>{displayRef(member.userId as any)}</TableCell>
                        <TableCell>{displayRef(member.familyId as any)}</TableCell>
                        <TableCell>{member.role ?? '—'}</TableCell>
                        <TableCell>
                          <Chip
                            label={member.status}
                            color={
                              member.status === 'active'
                                ? 'success'
                                : member.status === 'pending'
                                ? 'warning'
                                : 'error'
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            onClick={() =>
                              handleUpdateMemberStatus(
                                member.id || member._id || '',
                                member.status === 'active' ? 'inactive' : 'active'
                              )
                            }
                          >
                            {member.status === 'active' ? 'Deactivate' : 'Activate'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Edit Family Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Family</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={editForm.description}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FamilyManagement; 
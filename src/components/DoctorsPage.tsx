import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { doctorsMaster, syncDoctorsToDatabase } from '../data/doctorsMaster';
import type { Doctor } from '../data/doctorsMaster';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState<Doctor>({
    name: '',
    qualification: '',
    specialization: 'Resident Medical Officer',
    registrationNumber: '',
    department: 'Ward',
    role: 'RMO',
    is_active: true
  });
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      setFilteredDoctors(
        doctors.filter(
          (d) =>
            d.name.toLowerCase().includes(query) ||
            d.qualification.toLowerCase().includes(query) ||
            d.registrationNumber.toLowerCase().includes(query) ||
            d.department.toLowerCase().includes(query)
        )
      );
    } else {
      setFilteredDoctors(doctors);
    }
    setPage(0);
  }, [doctors, searchQuery]);

  const loadDoctors = async () => {
    setIsLoading(true);
    try {
      setDoctors(doctorsMaster);
    } catch (error) {
      console.error('Error loading doctors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (doctor?: Doctor) => {
    if (doctor) {
      setEditingDoctor(doctor);
      setFormData({ ...doctor });
    } else {
      setEditingDoctor(null);
      setFormData({
        name: '',
        qualification: '',
        specialization: 'Resident Medical Officer',
        registrationNumber: '',
        department: 'Ward',
        role: 'RMO',
        is_active: true
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingDoctor(null);
  };

  const handleSave = () => {
    if (!formData.name || !formData.qualification) {
      setSnackbar({ open: true, message: 'Name and Qualification are required', severity: 'error' });
      return;
    }

    if (editingDoctor) {
      setDoctors(doctors.map(d => d.name === editingDoctor.name ? formData : d));
      setSnackbar({ open: true, message: 'Doctor updated locally', severity: 'success' });
    } else {
      setDoctors([formData, ...doctors]);
      setSnackbar({ open: true, message: 'Doctor added locally', severity: 'success' });
    }
    handleCloseDialog();
  };

  const handleDelete = (name: string) => {
    if (confirm(`Are you sure you want to delete Dr. ${name}?`)) {
      setDoctors(doctors.filter(d => d.name !== name));
      setSnackbar({ open: true, message: 'Doctor removed locally', severity: 'success' });
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await syncDoctorsToDatabase();
      setSnackbar({
        open: true,
        message: 'Doctors synced to database successfully',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to sync doctors',
        severity: 'error',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Icon color="primary">medication_liquid</Icon>
            Resident Doctors (RMO)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Master list of full-time hospital doctors and RMOs
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={isSyncing ? <CircularProgress size={20} color="inherit" /> : <Icon>sync</Icon>}
            onClick={handleSync}
            disabled={isSyncing}
          >
            {isSyncing ? 'Syncing...' : 'Sync to Database'}
          </Button>
          <Button
            variant="contained"
            startIcon={<Icon>add</Icon>}
            onClick={() => handleOpenDialog()}
          >
            Add Doctor
          </Button>
        </Box>
      </Box>

      {/* Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by name, qualification, or registration..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Icon>search</Icon>
              </InputAdornment>
            ),
          }}
          size="small"
        />
      </Paper>

      {/* Table */}
      <Paper>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Emp. ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Doctor Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Qualification</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Reg. Number</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filteredDoctors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No doctors found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredDoctors
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((doc, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600} color="primary">
                        {doc.emp_id_no || '---'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={500}>{doc.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={doc.qualification} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {doc.registrationNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>{doc.department}</TableCell>
                    <TableCell>
                      <Chip label={doc.role} size="small" color="primary" />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton size="small" color="primary" onClick={() => handleOpenDialog(doc)}>
                        <Icon>edit</Icon>
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(doc.name)}>
                        <Icon>delete</Icon>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredDoctors.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingDoctor ? 'Edit Resident Doctor' : 'Add New Resident Doctor'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Emp. ID No."
              fullWidth
              value={formData.emp_id_no}
              onChange={(e) => setFormData({ ...formData, emp_id_no: e.target.value })}
              placeholder="e.g., HOPE/DOC/001"
            />
            <TextField
              label="Doctor Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              label="Qualification"
              fullWidth
              value={formData.qualification}
              onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
            />
            <TextField
              label="Registration Number"
              fullWidth
              value={formData.registrationNumber}
              onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
            />
            <TextField
              label="Department"
              fullWidth
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
            <TextField
              label="Role"
              fullWidth
              select
              slotProps={{ select: { native: true } }}
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as 'RMO' | 'Full-time' | 'Resident' })}
            >
              <option value="RMO">RMO</option>
              <option value="Full-time">Full-time</option>
              <option value="Resident">Resident</option>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Icon from '@mui/material/Icon';
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
import { visitingConsultantsMaster, syncConsultantsToDatabase } from '../data/visitingConsultantsMaster';
import type { VisitingConsultant } from '../data/visitingConsultantsMaster';

export default function VisitingConsultantsPage() {
  const [consultants, setConsultants] = useState<VisitingConsultant[]>([]);
  const [filteredConsultants, setFilteredConsultants] = useState<VisitingConsultant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    loadConsultants();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      setFilteredConsultants(
        consultants.filter(
          (c) =>
            c.name.toLowerCase().includes(query) ||
            c.specialization.toLowerCase().includes(query) ||
            c.registrationNumber.toLowerCase().includes(query)
        )
      );
    } else {
      setFilteredConsultants(consultants);
    }
    setPage(0);
  }, [consultants, searchQuery]);

  const loadConsultants = async () => {
    setIsLoading(true);
    try {
      // In this version, we primary show from the master file
      setConsultants(visitingConsultantsMaster);
    } catch (error) {
      console.error('Error loading consultants:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await syncConsultantsToDatabase();
      setSnackbar({
        open: true,
        message: 'Consultants synced to database successfully',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to sync consultants',
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
            <Icon color="primary">medical_information</Icon>
            Visiting Consultants
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Master list of visiting doctors and their registrations
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={isSyncing ? <CircularProgress size={20} color="inherit" /> : <Icon>sync</Icon>}
          onClick={handleSync}
          disabled={isSyncing}
        >
          {isSyncing ? 'Syncing...' : 'Sync to Database'}
        </Button>
      </Box>

      {/* Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by name, specialization, or registration number..."
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
                <TableCell sx={{ fontWeight: 600 }}>Doctor Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Specialization</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Registration Number</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filteredConsultants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No consultants found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredConsultants
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((consultant, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Typography fontWeight={500}>{consultant.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={consultant.specialization} size="small" variant="outlined" color="primary" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {consultant.registrationNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label="Master List" size="small" color="success" />
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
          count={filteredConsultants.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

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

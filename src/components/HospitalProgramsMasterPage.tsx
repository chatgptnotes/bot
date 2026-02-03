import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Chip,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Menu,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  LocalHospital as HospitalIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

interface HospitalProgram {
  id: string;
  name: string;
  description: string;
  category: 'Quality Improvement' | 'Patient Safety' | 'Infection Control' | 'Training' | 'Research' | 'Community Health' | 'Other';
  coordinator: string;
  department: string;
  startDate: string;
  endDate?: string;
  status: 'Active' | 'Completed' | 'On Hold' | 'Cancelled';
  objectives: string[];
  outcomes: string[];
  budget?: number;
  participants: number;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly' | 'One-time';
  nabhRelevant: boolean;
  createdAt: string;
  lastUpdated: string;
}

const DEFAULT_PROGRAMS: HospitalProgram[] = [
  {
    id: 'prog1',
    name: 'Hand Hygiene Compliance Program',
    description: 'Hospital-wide initiative to improve hand hygiene compliance among all healthcare workers',
    category: 'Infection Control',
    coordinator: 'Shilpi',
    department: 'Infection Control',
    startDate: '2025-01-01',
    status: 'Active',
    objectives: [
      'Achieve 95% hand hygiene compliance',
      'Reduce healthcare-associated infections by 20%',
      'Conduct monthly training sessions'
    ],
    outcomes: [
      'Current compliance rate: 88%',
      'HAI reduction: 15% in last quarter',
      'Training completed: 250 staff members'
    ],
    participants: 450,
    frequency: 'Monthly',
    nabhRelevant: true,
    createdAt: '2025-01-01',
    lastUpdated: '2026-02-01',
  },
  {
    id: 'prog2',
    name: 'Patient Safety Rounds',
    description: 'Regular patient safety rounds conducted by multidisciplinary teams',
    category: 'Patient Safety',
    coordinator: 'Sonali',
    department: 'Quality',
    startDate: '2025-06-01',
    status: 'Active',
    objectives: [
      'Identify patient safety risks proactively',
      'Improve communication between departments',
      'Implement corrective actions promptly'
    ],
    outcomes: [
      'Safety incidents reduced by 30%',
      'Patient satisfaction improved by 15%',
      'Communication gaps identified and resolved'
    ],
    participants: 85,
    frequency: 'Weekly',
    nabhRelevant: true,
    createdAt: '2025-06-01',
    lastUpdated: '2026-01-15',
  },
  {
    id: 'prog3',
    name: 'Code Blue Training Program',
    description: 'Comprehensive training program for cardiac arrest response',
    category: 'Training',
    coordinator: 'Farsana',
    department: 'Nursing',
    startDate: '2025-03-01',
    endDate: '2025-12-31',
    status: 'Completed',
    objectives: [
      'Train all clinical staff in Code Blue procedures',
      'Reduce response time to <3 minutes',
      'Improve survival rates'
    ],
    outcomes: [
      '100% staff training completed',
      'Average response time: 2.5 minutes',
      'Survival rate improved by 25%'
    ],
    participants: 320,
    frequency: 'Quarterly',
    nabhRelevant: true,
    createdAt: '2025-03-01',
    lastUpdated: '2026-01-01',
  },
  {
    id: 'prog4',
    name: 'Medication Safety Initiative',
    description: 'Program to reduce medication errors and improve pharmacy protocols',
    category: 'Patient Safety',
    coordinator: 'Abhishek',
    department: 'Pharmacy',
    startDate: '2025-02-01',
    status: 'Active',
    objectives: [
      'Reduce medication errors by 40%',
      'Implement double-check procedures',
      'Upgrade pharmacy information system'
    ],
    outcomes: [
      'Medication errors reduced by 35%',
      'Double-check system implemented',
      'New pharmacy system operational'
    ],
    participants: 25,
    frequency: 'Monthly',
    nabhRelevant: true,
    createdAt: '2025-02-01',
    lastUpdated: '2026-01-20',
  },
];

export default function HospitalProgramsMasterPage() {
  const [programs, setPrograms] = useState<HospitalProgram[]>(DEFAULT_PROGRAMS);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<HospitalProgram | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Form state
  const [programForm, setProgramForm] = useState<Partial<HospitalProgram>>({
    name: '',
    description: '',
    category: 'Quality Improvement',
    coordinator: '',
    department: '',
    startDate: '',
    endDate: '',
    status: 'Active',
    objectives: [],
    outcomes: [],
    participants: 0,
    frequency: 'Monthly',
    nabhRelevant: true,
  });

  const [objectivesText, setObjectivesText] = useState('');
  const [outcomesText, setOutcomesText] = useState('');

  const handleAddProgram = () => {
    const newProgram: HospitalProgram = {
      id: `prog_${Date.now()}`,
      ...(programForm as Omit<HospitalProgram, 'id'>),
      objectives: objectivesText.split('\n').filter(obj => obj.trim()),
      outcomes: outcomesText.split('\n').filter(out => out.trim()),
      createdAt: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    setPrograms([...programs, newProgram]);
    resetForm();
    setIsAddDialogOpen(false);
    setSnackbar({ open: true, message: 'Program added successfully', severity: 'success' });
  };

  const handleEditProgram = (program: HospitalProgram) => {
    setProgramForm(program);
    setObjectivesText(program.objectives.join('\n'));
    setOutcomesText(program.outcomes.join('\n'));
    setSelectedProgram(program);
    setIsEditDialogOpen(true);
    setMenuAnchor(null);
  };

  const handleUpdateProgram = () => {
    if (!selectedProgram) return;

    const updatedProgram: HospitalProgram = {
      ...selectedProgram,
      ...programForm,
      objectives: objectivesText.split('\n').filter(obj => obj.trim()),
      outcomes: outcomesText.split('\n').filter(out => out.trim()),
      lastUpdated: new Date().toISOString().split('T')[0],
    } as HospitalProgram;

    setPrograms(programs.map(p => p.id === selectedProgram.id ? updatedProgram : p));
    resetForm();
    setIsEditDialogOpen(false);
    setSnackbar({ open: true, message: 'Program updated successfully', severity: 'success' });
  };

  const handleDeleteProgram = (program: HospitalProgram) => {
    setSelectedProgram(program);
    setIsDeleteDialogOpen(true);
    setMenuAnchor(null);
  };

  const handleConfirmDelete = () => {
    if (!selectedProgram) return;
    
    setPrograms(programs.filter(p => p.id !== selectedProgram.id));
    setIsDeleteDialogOpen(false);
    setSnackbar({ open: true, message: 'Program deleted successfully', severity: 'success' });
  };

  const resetForm = () => {
    setProgramForm({
      name: '',
      description: '',
      category: 'Quality Improvement',
      coordinator: '',
      department: '',
      startDate: '',
      endDate: '',
      status: 'Active',
      participants: 0,
      frequency: 'Monthly',
      nabhRelevant: true,
    });
    setObjectivesText('');
    setOutcomesText('');
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, program: HospitalProgram) => {
    setMenuAnchor(event.currentTarget);
    setSelectedProgram(program);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Completed': return 'primary';
      case 'On Hold': return 'warning';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Quality Improvement': return '📊';
      case 'Patient Safety': return '🛡️';
      case 'Infection Control': return '🧼';
      case 'Training': return '🎓';
      case 'Research': return '🔬';
      case 'Community Health': return '🏘️';
      default: return '📋';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <HospitalIcon sx={{ color: 'primary.main', fontSize: 32 }} />
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Hospital Programs Master
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Manage all hospital programs and initiatives
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsAddDialogOpen(true)}
        >
          Add Program
        </Button>
      </Box>

      {/* Stats */}
      <Box display="flex" gap={2} mb={4} flexWrap="wrap">
        <Card sx={{ minWidth: 200 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h3" color="primary" fontWeight="bold">
              {programs.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Programs
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h3" color="success.main" fontWeight="bold">
              {programs.filter(p => p.status === 'Active').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Programs
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h3" color="warning.main" fontWeight="bold">
              {programs.filter(p => p.nabhRelevant).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              NABH Relevant
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h3" color="info.main" fontWeight="bold">
              {programs.reduce((acc, p) => acc + p.participants, 0)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Participants
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Programs Grid */}
      <Box display="flex" gap={3} flexWrap="wrap">
        {programs.map(program => (
          <Box flex="1" minWidth="400px" key={program.id}>
            <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body1" sx={{ fontSize: '1.5em' }}>
                      {getCategoryIcon(program.category)}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {program.name}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    {program.nabhRelevant && (
                      <Chip label="NABH" size="small" color="error" />
                    )}
                    <Chip 
                      label={program.status} 
                      size="small" 
                      color={getStatusColor(program.status) as any}
                    />
                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, program)}>
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" mb={2}>
                  {program.description}
                </Typography>

                <Box mb={2}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    <PersonIcon sx={{ fontSize: 14, mr: 0.5 }} />
                    {program.coordinator} • {program.department} • {program.participants} participants
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    <ScheduleIcon sx={{ fontSize: 14, mr: 0.5 }} />
                    {program.frequency} • Started: {new Date(program.startDate).toLocaleDateString()}
                  </Typography>
                </Box>

                <Box mb={2}>
                  <Typography variant="subtitle2" gutterBottom>Objectives:</Typography>
                  {program.objectives.slice(0, 2).map((obj, index) => (
                    <Typography key={index} variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                      • {obj}
                    </Typography>
                  ))}
                  {program.objectives.length > 2 && (
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                      +{program.objectives.length - 2} more objectives
                    </Typography>
                  )}
                </Box>

                {program.outcomes.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>Recent Outcomes:</Typography>
                    {program.outcomes.slice(0, 2).map((outcome, index) => (
                      <Typography key={index} variant="body2" color="success.main" sx={{ fontSize: '0.85rem' }}>
                        ✓ {outcome}
                      </Typography>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Actions Menu */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
        <MenuItem onClick={() => selectedProgram && handleEditProgram(selectedProgram)}>
          <EditIcon sx={{ mr: 1 }} />
          Edit Program
        </MenuItem>
        <MenuItem 
          onClick={() => selectedProgram && handleDeleteProgram(selectedProgram)}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ mr: 1 }} />
          Delete Program
        </MenuItem>
      </Menu>

      {/* Add Program Dialog */}
      <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Hospital Program</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Program Name"
              fullWidth
              value={programForm.name || ''}
              onChange={(e) => setProgramForm({ ...programForm, name: e.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={programForm.description || ''}
              onChange={(e) => setProgramForm({ ...programForm, description: e.target.value })}
            />
            <Box display="flex" gap={2}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={programForm.category || 'Quality Improvement'}
                  onChange={(e) => setProgramForm({ ...programForm, category: e.target.value as any })}
                >
                  <MenuItem value="Quality Improvement">Quality Improvement</MenuItem>
                  <MenuItem value="Patient Safety">Patient Safety</MenuItem>
                  <MenuItem value="Infection Control">Infection Control</MenuItem>
                  <MenuItem value="Training">Training</MenuItem>
                  <MenuItem value="Research">Research</MenuItem>
                  <MenuItem value="Community Health">Community Health</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={programForm.status || 'Active'}
                  onChange={(e) => setProgramForm({ ...programForm, status: e.target.value as any })}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="On Hold">On Hold</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box display="flex" gap={2}>
              <TextField
                label="Coordinator"
                fullWidth
                value={programForm.coordinator || ''}
                onChange={(e) => setProgramForm({ ...programForm, coordinator: e.target.value })}
              />
              <TextField
                label="Department"
                fullWidth
                value={programForm.department || ''}
                onChange={(e) => setProgramForm({ ...programForm, department: e.target.value })}
              />
            </Box>
            <Box display="flex" gap={2}>
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                value={programForm.startDate || ''}
                onChange={(e) => setProgramForm({ ...programForm, startDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="End Date (Optional)"
                type="date"
                fullWidth
                value={programForm.endDate || ''}
                onChange={(e) => setProgramForm({ ...programForm, endDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box display="flex" gap={2}>
              <TextField
                label="Participants"
                type="number"
                fullWidth
                value={programForm.participants || ''}
                onChange={(e) => setProgramForm({ ...programForm, participants: parseInt(e.target.value) || 0 })}
              />
              <FormControl fullWidth>
                <InputLabel>Frequency</InputLabel>
                <Select
                  value={programForm.frequency || 'Monthly'}
                  onChange={(e) => setProgramForm({ ...programForm, frequency: e.target.value as any })}
                >
                  <MenuItem value="Daily">Daily</MenuItem>
                  <MenuItem value="Weekly">Weekly</MenuItem>
                  <MenuItem value="Monthly">Monthly</MenuItem>
                  <MenuItem value="Quarterly">Quarterly</MenuItem>
                  <MenuItem value="Yearly">Yearly</MenuItem>
                  <MenuItem value="One-time">One-time</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <TextField
              label="Objectives (one per line)"
              fullWidth
              multiline
              rows={4}
              value={objectivesText}
              onChange={(e) => setObjectivesText(e.target.value)}
            />
            <TextField
              label="Outcomes/Results (one per line)"
              fullWidth
              multiline
              rows={3}
              value={outcomesText}
              onChange={(e) => setOutcomesText(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setIsAddDialogOpen(false); resetForm(); }}>Cancel</Button>
          <Button variant="contained" onClick={handleAddProgram}>Add Program</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Program Dialog */}
      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Hospital Program</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Program Name"
              fullWidth
              value={programForm.name || ''}
              onChange={(e) => setProgramForm({ ...programForm, name: e.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={programForm.description || ''}
              onChange={(e) => setProgramForm({ ...programForm, description: e.target.value })}
            />
            <Box display="flex" gap={2}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={programForm.category || 'Quality Improvement'}
                  onChange={(e) => setProgramForm({ ...programForm, category: e.target.value as any })}
                >
                  <MenuItem value="Quality Improvement">Quality Improvement</MenuItem>
                  <MenuItem value="Patient Safety">Patient Safety</MenuItem>
                  <MenuItem value="Infection Control">Infection Control</MenuItem>
                  <MenuItem value="Training">Training</MenuItem>
                  <MenuItem value="Research">Research</MenuItem>
                  <MenuItem value="Community Health">Community Health</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={programForm.status || 'Active'}
                  onChange={(e) => setProgramForm({ ...programForm, status: e.target.value as any })}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="On Hold">On Hold</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box display="flex" gap={2}>
              <TextField
                label="Coordinator"
                fullWidth
                value={programForm.coordinator || ''}
                onChange={(e) => setProgramForm({ ...programForm, coordinator: e.target.value })}
              />
              <TextField
                label="Department"
                fullWidth
                value={programForm.department || ''}
                onChange={(e) => setProgramForm({ ...programForm, department: e.target.value })}
              />
            </Box>
            <Box display="flex" gap={2}>
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                value={programForm.startDate || ''}
                onChange={(e) => setProgramForm({ ...programForm, startDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="End Date (Optional)"
                type="date"
                fullWidth
                value={programForm.endDate || ''}
                onChange={(e) => setProgramForm({ ...programForm, endDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box display="flex" gap={2}>
              <TextField
                label="Participants"
                type="number"
                fullWidth
                value={programForm.participants || ''}
                onChange={(e) => setProgramForm({ ...programForm, participants: parseInt(e.target.value) || 0 })}
              />
              <FormControl fullWidth>
                <InputLabel>Frequency</InputLabel>
                <Select
                  value={programForm.frequency || 'Monthly'}
                  onChange={(e) => setProgramForm({ ...programForm, frequency: e.target.value as any })}
                >
                  <MenuItem value="Daily">Daily</MenuItem>
                  <MenuItem value="Weekly">Weekly</MenuItem>
                  <MenuItem value="Monthly">Monthly</MenuItem>
                  <MenuItem value="Quarterly">Quarterly</MenuItem>
                  <MenuItem value="Yearly">Yearly</MenuItem>
                  <MenuItem value="One-time">One-time</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <TextField
              label="Objectives (one per line)"
              fullWidth
              multiline
              rows={4}
              value={objectivesText}
              onChange={(e) => setObjectivesText(e.target.value)}
            />
            <TextField
              label="Outcomes/Results (one per line)"
              fullWidth
              multiline
              rows={3}
              value={outcomesText}
              onChange={(e) => setOutcomesText(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setIsEditDialogOpen(false); resetForm(); }}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateProgram}>Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Delete Program</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{selectedProgram?.name}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleConfirmDelete}
            startIcon={<DeleteIcon />}
          >
            Delete Program
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
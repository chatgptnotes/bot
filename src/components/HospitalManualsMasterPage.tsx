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
  Icon,
  // LinearProgress removed - unused import
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  MenuBook as ManualIcon,
  CloudDownload as DownloadIcon,
  Visibility as ViewIcon,
  Update as UpdateIcon,
} from '@mui/icons-material';

interface HospitalManual {
  id: string;
  title: string;
  description: string;
  category: 'Policy & Procedures' | 'Emergency Response' | 'Infection Control' | 'Quality Management' | 'Safety & Security' | 'HR & Admin' | 'Clinical Protocols' | 'Equipment & Technology' | 'Other';
  version: string;
  author: string;
  department: string;
  createdDate: string;
  lastUpdated: string;
  nextReviewDate: string;
  status: 'Current' | 'Under Review' | 'Expired' | 'Draft' | 'Archived';
  approvedBy: string;
  fileUrl?: string;
  fileSize?: string;
  pageCount?: number;
  nabhRelevant: boolean;
  nabhStandards: string[];
  tags: string[];
  reviewFrequency: 'Monthly' | 'Quarterly' | 'Half-yearly' | 'Yearly' | 'As needed';
  documentsLink?: string; // Google Docs/Sheets link
  distributionList: string[];
  implementationDate?: string;
  trainingRequired: boolean;
}

const DEFAULT_MANUALS: HospitalManual[] = [
  {
    id: 'manual1',
    title: 'Hospital Infection Control Manual',
    description: 'Comprehensive guidelines for infection prevention and control across all hospital departments',
    category: 'Infection Control',
    version: '3.2',
    author: 'Shilpi',
    department: 'Infection Control',
    createdDate: '2024-01-15',
    lastUpdated: '2026-01-15',
    nextReviewDate: '2026-07-15',
    status: 'Current',
    approvedBy: 'Dr. Shiraz Khan',
    fileSize: '2.4 MB',
    pageCount: 156,
    nabhRelevant: true,
    nabhStandards: ['HIC.1', 'HIC.2', 'HIC.3', 'HIC.4'],
    tags: ['Hand Hygiene', 'PPE', 'Sterilization', 'Isolation Protocols'],
    reviewFrequency: 'Half-yearly',
    distributionList: ['All Clinical Staff', 'Housekeeping', 'Security'],
    implementationDate: '2024-02-01',
    trainingRequired: true,
  },
  {
    id: 'manual2',
    title: 'Emergency Response & Disaster Management Manual',
    description: 'Protocols for emergency response, disaster preparedness, and crisis management',
    category: 'Emergency Response',
    version: '2.1',
    author: 'Gaurav Agrawal',
    department: 'Administration',
    createdDate: '2024-03-01',
    lastUpdated: '2025-12-01',
    nextReviewDate: '2026-06-01',
    status: 'Current',
    approvedBy: 'Dr. Murali BK',
    fileSize: '1.8 MB',
    pageCount: 98,
    nabhRelevant: true,
    nabhStandards: ['FMS.1', 'FMS.2', 'PSQ.1'],
    tags: ['Fire Safety', 'Code Blue', 'Evacuation', 'Mass Casualty'],
    reviewFrequency: 'Yearly',
    distributionList: ['All Staff', 'Security', 'Maintenance'],
    implementationDate: '2024-04-01',
    trainingRequired: true,
  },
  {
    id: 'manual3',
    title: 'Quality Management System Manual',
    description: 'NABH quality management system policies, procedures, and continuous improvement processes',
    category: 'Quality Management',
    version: '4.0',
    author: 'Sonali',
    department: 'Quality Department',
    createdDate: '2023-06-01',
    lastUpdated: '2026-01-01',
    nextReviewDate: '2026-12-31',
    status: 'Current',
    approvedBy: 'Dr. Shiraz Khan',
    fileSize: '3.1 MB',
    pageCount: 245,
    nabhRelevant: true,
    nabhStandards: ['CQI.1', 'CQI.2', 'CQI.3', 'PSQ.2', 'PSQ.3'],
    tags: ['NABH Standards', 'Quality Indicators', 'PDCA Cycle', 'Risk Management'],
    reviewFrequency: 'Yearly',
    distributionList: ['Quality Team', 'Department Heads', 'Senior Management'],
    implementationDate: '2023-07-01',
    trainingRequired: true,
  },
  {
    id: 'manual4',
    title: 'Medication Management & Safety Manual',
    description: 'Comprehensive guide for safe medication practices, storage, and administration',
    category: 'Clinical Protocols',
    version: '2.5',
    author: 'Abhishek',
    department: 'Pharmacy',
    createdDate: '2024-05-01',
    lastUpdated: '2025-11-15',
    nextReviewDate: '2026-05-15',
    status: 'Current',
    approvedBy: 'Dr. Sachin',
    fileSize: '1.6 MB',
    pageCount: 112,
    nabhRelevant: true,
    nabhStandards: ['PCC.8', 'PCC.9', 'MOM.2'],
    tags: ['High Alert Drugs', '5 Rights', 'Drug Storage', 'Adverse Events'],
    reviewFrequency: 'Half-yearly',
    distributionList: ['Nursing Staff', 'Pharmacy', 'Doctors'],
    implementationDate: '2024-06-01',
    trainingRequired: true,
  },
  {
    id: 'manual5',
    title: 'Human Resources Policy Manual',
    description: 'HR policies, procedures, staff recruitment, training, and performance management',
    category: 'HR & Admin',
    version: '1.8',
    author: 'K J Shashank',
    department: 'Human Resources',
    createdDate: '2024-02-01',
    lastUpdated: '2025-08-01',
    nextReviewDate: '2026-08-01',
    status: 'Under Review',
    approvedBy: 'Viji Murali',
    fileSize: '2.2 MB',
    pageCount: 134,
    nabhRelevant: true,
    nabhStandards: ['HRM.1', 'HRM.2', 'HRM.3'],
    tags: ['Recruitment', 'Training', 'Performance', 'Disciplinary'],
    reviewFrequency: 'Yearly',
    distributionList: ['HR Team', 'Department Heads', 'Management'],
    implementationDate: '2024-03-01',
    trainingRequired: false,
  },
  {
    id: 'manual6',
    title: 'Medical Records Management Manual',
    description: 'Guidelines for medical record creation, maintenance, storage, and retrieval',
    category: 'Clinical Protocols',
    version: '3.0',
    author: 'Azhar',
    department: 'Medical Records',
    createdDate: '2024-04-01',
    lastUpdated: '2026-01-20',
    nextReviewDate: '2026-10-20',
    status: 'Current',
    approvedBy: 'Dr. Shiraz Khan',
    fileSize: '1.9 MB',
    pageCount: 87,
    nabhRelevant: true,
    nabhStandards: ['MOM.1', 'MOM.3', 'MOM.4'],
    tags: ['Documentation', 'Record Retention', 'Confidentiality', 'Audit Trail'],
    reviewFrequency: 'Half-yearly',
    distributionList: ['MRD Staff', 'Clinical Staff', 'Quality Team'],
    implementationDate: '2024-05-01',
    trainingRequired: true,
  },
  {
    id: 'manual7',
    title: 'Patient Safety & Risk Management Manual',
    description: 'Comprehensive patient safety protocols, incident reporting, and risk mitigation strategies',
    category: 'Safety & Security',
    version: '2.3',
    author: 'Sonali',
    department: 'Quality Department',
    createdDate: '2024-01-01',
    lastUpdated: '2025-10-01',
    nextReviewDate: '2026-04-01',
    status: 'Current',
    approvedBy: 'Dr. Murali BK',
    fileSize: '2.7 MB',
    pageCount: 178,
    nabhRelevant: true,
    nabhStandards: ['PSQ.1', 'PSQ.2', 'PSQ.3', 'PSQ.4'],
    tags: ['Patient Safety', 'Risk Assessment', 'Incident Reporting', 'Root Cause Analysis'],
    reviewFrequency: 'Half-yearly',
    distributionList: ['All Clinical Staff', 'Quality Team', 'Management'],
    implementationDate: '2024-02-01',
    trainingRequired: true,
  },
];

export default function HospitalManualsMasterPage() {
  const [manuals, setManuals] = useState<HospitalManual[]>(DEFAULT_MANUALS);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedManual, setSelectedManual] = useState<HospitalManual | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Form state
  const [manualForm, setManualForm] = useState<Partial<HospitalManual>>({
    title: '',
    description: '',
    category: 'Policy & Procedures',
    version: '1.0',
    author: '',
    department: '',
    createdDate: '',
    status: 'Draft',
    approvedBy: '',
    reviewFrequency: 'Yearly',
    nabhRelevant: false,
    trainingRequired: false,
    tags: [],
    nabhStandards: [],
    distributionList: [],
    documentsLink: '',
  });

  const [tagsText, setTagsText] = useState('');
  const [nabhStandardsText, setNabhStandardsText] = useState('');
  const [distributionText, setDistributionText] = useState('');

  const handleAddManual = () => {
    const newManual: HospitalManual = {
      id: `manual_${Date.now()}`,
      ...(manualForm as Omit<HospitalManual, 'id'>),
      tags: tagsText.split(',').map(tag => tag.trim()).filter(tag => tag),
      nabhStandards: nabhStandardsText.split(',').map(std => std.trim()).filter(std => std),
      distributionList: distributionText.split(',').map(dist => dist.trim()).filter(dist => dist),
      lastUpdated: new Date().toISOString().split('T')[0],
      nextReviewDate: getNextReviewDate(manualForm.reviewFrequency || 'Yearly'),
    };

    setManuals([...manuals, newManual]);
    resetForm();
    setIsAddDialogOpen(false);
    setSnackbar({ open: true, message: 'Manual added successfully', severity: 'success' });
  };

  const handleEditManual = (manual: HospitalManual) => {
    setManualForm(manual);
    setTagsText(manual.tags.join(', '));
    setNabhStandardsText(manual.nabhStandards.join(', '));
    setDistributionText(manual.distributionList.join(', '));
    setSelectedManual(manual);
    setIsEditDialogOpen(true);
    setMenuAnchor(null);
  };

  const handleUpdateManual = () => {
    if (!selectedManual) return;

    const updatedManual: HospitalManual = {
      ...selectedManual,
      ...manualForm,
      tags: tagsText.split(',').map(tag => tag.trim()).filter(tag => tag),
      nabhStandards: nabhStandardsText.split(',').map(std => std.trim()).filter(std => std),
      distributionList: distributionText.split(',').map(dist => dist.trim()).filter(dist => dist),
      lastUpdated: new Date().toISOString().split('T')[0],
    } as HospitalManual;

    setManuals(manuals.map(m => m.id === selectedManual.id ? updatedManual : m));
    resetForm();
    setIsEditDialogOpen(false);
    setSnackbar({ open: true, message: 'Manual updated successfully', severity: 'success' });
  };

  const handleDeleteManual = (manual: HospitalManual) => {
    setSelectedManual(manual);
    setIsDeleteDialogOpen(true);
    setMenuAnchor(null);
  };

  const handleConfirmDelete = () => {
    if (!selectedManual) return;
    
    setManuals(manuals.filter(m => m.id !== selectedManual.id));
    setIsDeleteDialogOpen(false);
    setSnackbar({ open: true, message: 'Manual deleted successfully', severity: 'success' });
  };

  const resetForm = () => {
    setManualForm({
      title: '',
      description: '',
      category: 'Policy & Procedures',
      version: '1.0',
      author: '',
      department: '',
      createdDate: '',
      status: 'Draft',
      approvedBy: '',
      reviewFrequency: 'Yearly',
      nabhRelevant: false,
      trainingRequired: false,
    });
    setTagsText('');
    setNabhStandardsText('');
    setDistributionText('');
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, manual: HospitalManual) => {
    setMenuAnchor(event.currentTarget);
    setSelectedManual(manual);
  };

  const getNextReviewDate = (frequency: string): string => {
    const now = new Date();
    switch (frequency) {
      case 'Monthly':
        now.setMonth(now.getMonth() + 1);
        break;
      case 'Quarterly':
        now.setMonth(now.getMonth() + 3);
        break;
      case 'Half-yearly':
        now.setMonth(now.getMonth() + 6);
        break;
      case 'Yearly':
        now.setFullYear(now.getFullYear() + 1);
        break;
      default:
        now.setFullYear(now.getFullYear() + 1);
    }
    return now.toISOString().split('T')[0];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Current': return 'success';
      case 'Under Review': return 'warning';
      case 'Expired': return 'error';
      case 'Draft': return 'info';
      case 'Archived': return 'default';
      default: return 'default';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Policy & Procedures': return '📋';
      case 'Emergency Response': return '🚨';
      case 'Infection Control': return '🧼';
      case 'Quality Management': return '📊';
      case 'Safety & Security': return '🛡️';
      case 'HR & Admin': return '👥';
      case 'Clinical Protocols': return '⚕️';
      case 'Equipment & Technology': return '🔧';
      default: return '📚';
    }
  };

  const isOverdue = (nextReviewDate: string): boolean => {
    return new Date(nextReviewDate) < new Date();
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <ManualIcon sx={{ color: 'primary.main', fontSize: 32 }} />
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Hospital Manuals Master
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Manage all hospital policies, procedures, and operational manuals
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsAddDialogOpen(true)}
        >
          Add Manual
        </Button>
      </Box>

      {/* Stats */}
      <Box display="flex" gap={2} mb={4} flexWrap="wrap">
        <Card sx={{ minWidth: 200 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h3" color="primary" fontWeight="bold">
              {manuals.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Manuals
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h3" color="success.main" fontWeight="bold">
              {manuals.filter(m => m.status === 'Current').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Current
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h3" color="warning.main" fontWeight="bold">
              {manuals.filter(m => isOverdue(m.nextReviewDate)).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Overdue Review
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h3" color="error.main" fontWeight="bold">
              {manuals.filter(m => m.nabhRelevant).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              NABH Relevant
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Manuals Grid */}
      <Box display="flex" gap={3} flexWrap="wrap">
        {manuals.map(manual => (
          <Box flex="1" minWidth="400px" key={manual.id}>
            <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body1" sx={{ fontSize: '1.5em' }}>
                      {getCategoryIcon(manual.category)}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {manual.title}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    {manual.nabhRelevant && (
                      <Chip label="NABH" size="small" color="error" />
                    )}
                    {isOverdue(manual.nextReviewDate) && (
                      <Chip label="OVERDUE" size="small" color="error" />
                    )}
                    <Chip 
                      label={manual.status} 
                      size="small" 
                      color={getStatusColor(manual.status) as any}
                    />
                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, manual)}>
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" mb={2}>
                  {manual.description}
                </Typography>

                <Box mb={2}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    <ViewIcon sx={{ fontSize: 14, mr: 0.5 }} />
                    Version {manual.version} • Author: {manual.author} • {manual.department}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    <UpdateIcon sx={{ fontSize: 14, mr: 0.5 }} />
                    Updated: {new Date(manual.lastUpdated).toLocaleDateString()} • 
                    Review: {new Date(manual.nextReviewDate).toLocaleDateString()}
                  </Typography>
                  {manual.fileSize && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      <DownloadIcon sx={{ fontSize: 14, mr: 0.5 }} />
                      {manual.fileSize} • {manual.pageCount} pages
                    </Typography>
                  )}
                </Box>

                {manual.nabhStandards.length > 0 && (
                  <Box mb={2}>
                    <Typography variant="subtitle2" gutterBottom>NABH Standards:</Typography>
                    <Box display="flex" gap={0.5} flexWrap="wrap">
                      {manual.nabhStandards.slice(0, 4).map(standard => (
                        <Chip
                          key={standard}
                          label={standard}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                      {manual.nabhStandards.length > 4 && (
                        <Chip
                          label={`+${manual.nabhStandards.length - 4} more`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </Box>
                )}

                <Box mb={2}>
                  <Typography variant="subtitle2" gutterBottom>Tags:</Typography>
                  <Box display="flex" gap={0.5} flexWrap="wrap">
                    {manual.tags.slice(0, 3).map(tag => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                    {manual.tags.length > 3 && (
                      <Chip
                        label={`+${manual.tags.length - 3} more`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Approved by: {manual.approvedBy} • Review: {manual.reviewFrequency}
                  </Typography>
                  {manual.trainingRequired && (
                    <Chip label="Training Required" size="small" color="warning" sx={{ mt: 1 }} />
                  )}
                </Box>

                {/* Documents Link Section */}
                <Box sx={{ mt: 2 }}>
                  <Box display="flex" alignItems="center" gap={0.5} mb={1}>
                    <Icon sx={{ fontSize: 16, color: 'primary.main' }}>link</Icon>
                    <Typography variant="caption" fontWeight="medium" color="text.secondary">
                      Documents Link:
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Google Docs/Sheets link..."
                      value={manual.documentsLink || ''}
                      onChange={(e) => {
                        const updatedManual = { ...manual, documentsLink: e.target.value };
                        setManuals(manuals.map(m => m.id === manual.id ? updatedManual : m));
                      }}
                      variant="outlined"
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          fontSize: '0.75rem',
                          height: '32px',
                        }
                      }}
                    />
                    {manual.documentsLink && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => window.open(manual.documentsLink, '_blank')}
                        sx={{ minWidth: 'auto', px: 1, height: 32, fontSize: '0.7rem' }}
                      >
                        Open
                      </Button>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Actions Menu */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
        <MenuItem onClick={() => selectedManual && handleEditManual(selectedManual)}>
          <EditIcon sx={{ mr: 1 }} />
          Edit Manual
        </MenuItem>
        <MenuItem 
          onClick={() => selectedManual && handleDeleteManual(selectedManual)}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ mr: 1 }} />
          Delete Manual
        </MenuItem>
      </Menu>

      {/* Add Manual Dialog */}
      <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Add New Hospital Manual</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Manual Title"
              fullWidth
              value={manualForm.title || ''}
              onChange={(e) => setManualForm({ ...manualForm, title: e.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={manualForm.description || ''}
              onChange={(e) => setManualForm({ ...manualForm, description: e.target.value })}
            />
            <Box display="flex" gap={2}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={manualForm.category || 'Policy & Procedures'}
                  onChange={(e) => setManualForm({ ...manualForm, category: e.target.value as any })}
                >
                  <MenuItem value="Policy & Procedures">Policy & Procedures</MenuItem>
                  <MenuItem value="Emergency Response">Emergency Response</MenuItem>
                  <MenuItem value="Infection Control">Infection Control</MenuItem>
                  <MenuItem value="Quality Management">Quality Management</MenuItem>
                  <MenuItem value="Safety & Security">Safety & Security</MenuItem>
                  <MenuItem value="HR & Admin">HR & Admin</MenuItem>
                  <MenuItem value="Clinical Protocols">Clinical Protocols</MenuItem>
                  <MenuItem value="Equipment & Technology">Equipment & Technology</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={manualForm.status || 'Draft'}
                  onChange={(e) => setManualForm({ ...manualForm, status: e.target.value as any })}
                >
                  <MenuItem value="Draft">Draft</MenuItem>
                  <MenuItem value="Under Review">Under Review</MenuItem>
                  <MenuItem value="Current">Current</MenuItem>
                  <MenuItem value="Expired">Expired</MenuItem>
                  <MenuItem value="Archived">Archived</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box display="flex" gap={2}>
              <TextField
                label="Version"
                fullWidth
                value={manualForm.version || ''}
                onChange={(e) => setManualForm({ ...manualForm, version: e.target.value })}
                placeholder="e.g., 1.0, 2.3"
              />
              <TextField
                label="Author"
                fullWidth
                value={manualForm.author || ''}
                onChange={(e) => setManualForm({ ...manualForm, author: e.target.value })}
              />
            </Box>
            <Box display="flex" gap={2}>
              <TextField
                label="Department"
                fullWidth
                value={manualForm.department || ''}
                onChange={(e) => setManualForm({ ...manualForm, department: e.target.value })}
              />
              <TextField
                label="Approved By"
                fullWidth
                value={manualForm.approvedBy || ''}
                onChange={(e) => setManualForm({ ...manualForm, approvedBy: e.target.value })}
              />
            </Box>
            <Box display="flex" gap={2}>
              <TextField
                label="Created Date"
                type="date"
                fullWidth
                value={manualForm.createdDate || ''}
                onChange={(e) => setManualForm({ ...manualForm, createdDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
              <FormControl fullWidth>
                <InputLabel>Review Frequency</InputLabel>
                <Select
                  value={manualForm.reviewFrequency || 'Yearly'}
                  onChange={(e) => setManualForm({ ...manualForm, reviewFrequency: e.target.value as any })}
                >
                  <MenuItem value="Monthly">Monthly</MenuItem>
                  <MenuItem value="Quarterly">Quarterly</MenuItem>
                  <MenuItem value="Half-yearly">Half-yearly</MenuItem>
                  <MenuItem value="Yearly">Yearly</MenuItem>
                  <MenuItem value="As needed">As needed</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box display="flex" gap={2} alignItems="center">
              <FormControl>
                <InputLabel>NABH Relevant</InputLabel>
                <Select
                  value={manualForm.nabhRelevant ? 'yes' : 'no'}
                  onChange={(e) => setManualForm({ ...manualForm, nabhRelevant: e.target.value === 'yes' })}
                >
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel>Training Required</InputLabel>
                <Select
                  value={manualForm.trainingRequired ? 'yes' : 'no'}
                  onChange={(e) => setManualForm({ ...manualForm, trainingRequired: e.target.value === 'yes' })}
                >
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <TextField
              label="NABH Standards (comma separated)"
              fullWidth
              value={nabhStandardsText}
              onChange={(e) => setNabhStandardsText(e.target.value)}
              placeholder="e.g., HIC.1, PCC.8, PSQ.2"
            />
            <TextField
              label="Tags (comma separated)"
              fullWidth
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="e.g., Hand Hygiene, PPE, Documentation"
            />
            <TextField
              label="Distribution List (comma separated)"
              fullWidth
              value={distributionText}
              onChange={(e) => setDistributionText(e.target.value)}
              placeholder="e.g., All Clinical Staff, Nursing, Pharmacy"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setIsAddDialogOpen(false); resetForm(); }}>Cancel</Button>
          <Button variant="contained" onClick={handleAddManual}>Add Manual</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Manual Dialog */}
      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Edit Hospital Manual</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Manual Title"
              fullWidth
              value={manualForm.title || ''}
              onChange={(e) => setManualForm({ ...manualForm, title: e.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={manualForm.description || ''}
              onChange={(e) => setManualForm({ ...manualForm, description: e.target.value })}
            />
            <Box display="flex" gap={2}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={manualForm.category || 'Policy & Procedures'}
                  onChange={(e) => setManualForm({ ...manualForm, category: e.target.value as any })}
                >
                  <MenuItem value="Policy & Procedures">Policy & Procedures</MenuItem>
                  <MenuItem value="Emergency Response">Emergency Response</MenuItem>
                  <MenuItem value="Infection Control">Infection Control</MenuItem>
                  <MenuItem value="Quality Management">Quality Management</MenuItem>
                  <MenuItem value="Safety & Security">Safety & Security</MenuItem>
                  <MenuItem value="HR & Admin">HR & Admin</MenuItem>
                  <MenuItem value="Clinical Protocols">Clinical Protocols</MenuItem>
                  <MenuItem value="Equipment & Technology">Equipment & Technology</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={manualForm.status || 'Draft'}
                  onChange={(e) => setManualForm({ ...manualForm, status: e.target.value as any })}
                >
                  <MenuItem value="Draft">Draft</MenuItem>
                  <MenuItem value="Under Review">Under Review</MenuItem>
                  <MenuItem value="Current">Current</MenuItem>
                  <MenuItem value="Expired">Expired</MenuItem>
                  <MenuItem value="Archived">Archived</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box display="flex" gap={2}>
              <TextField
                label="Version"
                fullWidth
                value={manualForm.version || ''}
                onChange={(e) => setManualForm({ ...manualForm, version: e.target.value })}
                placeholder="e.g., 1.0, 2.3"
              />
              <TextField
                label="Author"
                fullWidth
                value={manualForm.author || ''}
                onChange={(e) => setManualForm({ ...manualForm, author: e.target.value })}
              />
            </Box>
            <Box display="flex" gap={2}>
              <TextField
                label="Department"
                fullWidth
                value={manualForm.department || ''}
                onChange={(e) => setManualForm({ ...manualForm, department: e.target.value })}
              />
              <TextField
                label="Approved By"
                fullWidth
                value={manualForm.approvedBy || ''}
                onChange={(e) => setManualForm({ ...manualForm, approvedBy: e.target.value })}
              />
            </Box>
            <Box display="flex" gap={2}>
              <TextField
                label="Created Date"
                type="date"
                fullWidth
                value={manualForm.createdDate || ''}
                onChange={(e) => setManualForm({ ...manualForm, createdDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
              <FormControl fullWidth>
                <InputLabel>Review Frequency</InputLabel>
                <Select
                  value={manualForm.reviewFrequency || 'Yearly'}
                  onChange={(e) => setManualForm({ ...manualForm, reviewFrequency: e.target.value as any })}
                >
                  <MenuItem value="Monthly">Monthly</MenuItem>
                  <MenuItem value="Quarterly">Quarterly</MenuItem>
                  <MenuItem value="Half-yearly">Half-yearly</MenuItem>
                  <MenuItem value="Yearly">Yearly</MenuItem>
                  <MenuItem value="As needed">As needed</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box display="flex" gap={2} alignItems="center">
              <FormControl>
                <InputLabel>NABH Relevant</InputLabel>
                <Select
                  value={manualForm.nabhRelevant ? 'yes' : 'no'}
                  onChange={(e) => setManualForm({ ...manualForm, nabhRelevant: e.target.value === 'yes' })}
                >
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel>Training Required</InputLabel>
                <Select
                  value={manualForm.trainingRequired ? 'yes' : 'no'}
                  onChange={(e) => setManualForm({ ...manualForm, trainingRequired: e.target.value === 'yes' })}
                >
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <TextField
              label="NABH Standards (comma separated)"
              fullWidth
              value={nabhStandardsText}
              onChange={(e) => setNabhStandardsText(e.target.value)}
              placeholder="e.g., HIC.1, PCC.8, PSQ.2"
            />
            <TextField
              label="Tags (comma separated)"
              fullWidth
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="e.g., Hand Hygiene, PPE, Documentation"
            />
            <TextField
              label="Distribution List (comma separated)"
              fullWidth
              value={distributionText}
              onChange={(e) => setDistributionText(e.target.value)}
              placeholder="e.g., All Clinical Staff, Nursing, Pharmacy"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setIsEditDialogOpen(false); resetForm(); }}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateManual}>Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Delete Manual</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{selectedManual?.title}</strong>?
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
            Delete Manual
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
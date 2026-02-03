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
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Assignment as AuditIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';

interface ClinicalAudit {
  id: string;
  title: string;
  description: string;
  category: 'Patient Safety' | 'Quality Indicators' | 'Infection Control' | 'Medication Safety' | 'Documentation' | 'Compliance' | 'Other';
  auditType: 'Internal' | 'External' | 'Self Assessment' | 'Peer Review';
  department: string;
  auditor: string;
  startDate: string;
  completionDate?: string;
  status: 'Planned' | 'In Progress' | 'Completed' | 'Overdue' | 'Cancelled';
  frequency: 'Monthly' | 'Quarterly' | 'Half-yearly' | 'Yearly' | 'One-time';
  criteria: string[];
  findings: string[];
  recommendations: string[];
  actionItems: string[];
  compliance: number; // Percentage
  samplesReviewed: number;
  totalSamples: number;
  nabhStandard?: string;
  priority: 'High' | 'Medium' | 'Low';
  followUpDate?: string;
  createdAt: string;
  lastUpdated: string;
  documentsLink?: string; // Google Docs/Sheets link
}

const DEFAULT_AUDITS: ClinicalAudit[] = [
  {
    id: 'audit1',
    title: 'Hand Hygiene Compliance Audit - NABH Priority',
    description: 'Critical NABH audit for hand hygiene compliance across Hope Hospital - WHO 5 Moments focus',
    category: 'Infection Control',
    auditType: 'Internal',
    department: 'Infection Control',
    auditor: 'Shilpi',
    startDate: '2026-02-04',
    status: 'Planned',
    frequency: 'Monthly',
    criteria: [
      'WHO 5 Moments: Before patient contact',
      'WHO 5 Moments: Before clean/aseptic procedures', 
      'WHO 5 Moments: After body fluid exposure',
      'WHO 5 Moments: After patient contact',
      'WHO 5 Moments: After contact with patient surroundings',
      'Proper technique (20 seconds soap/water or alcohol rub)',
      'Availability of hand hygiene stations'
    ],
    findings: [],
    recommendations: [],
    actionItems: [
      'Observe 50 hand hygiene opportunities across all departments',
      'Document compliance for each WHO moment',
      'Provide immediate feedback to staff',
      'Identify areas needing additional dispensers',
      'Schedule re-audit after 3 days of intervention'
    ],
    compliance: 0,
    samplesReviewed: 0,
    totalSamples: 50,
    nabhStandard: 'HIC.1',
    priority: 'High',
    followUpDate: '2026-02-10',
    createdAt: '2026-02-03',
    lastUpdated: '2026-02-03',
    documentsLink: '', // Ready for Google Docs link
  },
  {
    id: 'audit2',
    title: 'Medication Error Prevention Audit',
    description: 'Quarterly review of medication administration processes and error prevention',
    category: 'Medication Safety',
    auditType: 'Internal',
    department: 'Pharmacy',
    auditor: 'Abhishek',
    startDate: '2026-01-15',
    status: 'In Progress',
    frequency: 'Quarterly',
    criteria: [
      '5 Rights of medication administration followed',
      'Double-check system implemented',
      'High-alert medications properly labeled',
      'Patient identification process correct'
    ],
    findings: [
      'Medication errors reduced by 35% from previous quarter',
      'Double-check compliance: 92%',
      'High-alert medication labeling: 98%',
      '3 near-miss events identified and resolved'
    ],
    recommendations: [
      'Implement barcode scanning system',
      'Enhance nurse training on high-alert medications',
      'Create standardized medication reconciliation form',
      'Establish medication safety committee'
    ],
    actionItems: [
      'Procure barcode scanners',
      'Schedule high-alert medication training',
      'Design medication reconciliation form',
      'Form medication safety committee'
    ],
    compliance: 92,
    samplesReviewed: 180,
    totalSamples: 200,
    nabhStandard: 'PCC.8',
    priority: 'High',
    followUpDate: '2026-03-01',
    createdAt: '2026-01-01',
    lastUpdated: '2026-02-03',
    documentsLink: '', // Ready for Google Docs link
  },
  {
    id: 'audit3',
    title: 'Patient Fall Prevention Audit',
    description: 'Assessment of fall prevention protocols and patient safety measures',
    category: 'Patient Safety',
    auditType: 'Internal',
    department: 'Nursing',
    auditor: 'Sonali',
    startDate: '2025-12-01',
    completionDate: '2025-12-31',
    status: 'Completed',
    frequency: 'Quarterly',
    criteria: [
      'Fall risk assessment completed within 24 hours',
      'Appropriate fall prevention measures implemented',
      'Patient and family education provided',
      'Environmental safety measures in place'
    ],
    findings: [
      'Fall risk assessments completed: 95%',
      'Prevention measures implemented: 90%',
      'Patient education completion: 85%',
      '2 falls occurred during audit period'
    ],
    recommendations: [
      'Standardize fall risk assessment tool',
      'Improve patient education materials',
      'Enhance environmental safety rounds',
      'Implement hourly rounding protocol'
    ],
    actionItems: [
      'Update fall risk assessment forms',
      'Create patient education pamphlets',
      'Schedule safety rounds training',
      'Pilot hourly rounding in high-risk areas'
    ],
    compliance: 90,
    samplesReviewed: 150,
    totalSamples: 150,
    nabhStandard: 'PSQ.3',
    priority: 'Medium',
    followUpDate: '2026-02-28',
    createdAt: '2025-11-15',
    lastUpdated: '2026-01-05',
    documentsLink: '', // Ready for Google Docs link
  },
  {
    id: 'audit4',
    title: 'Medical Records Documentation Audit',
    description: 'Review of medical record completeness and documentation quality',
    category: 'Documentation',
    auditType: 'Internal',
    department: 'Medical Records',
    auditor: 'Azhar',
    startDate: '2026-02-01',
    status: 'Planned',
    frequency: 'Monthly',
    criteria: [
      'Medical records completed within 48 hours',
      'All required signatures present',
      'Diagnosis and treatment plans documented',
      'Discharge summary completed before patient leaves'
    ],
    findings: [],
    recommendations: [],
    actionItems: [
      'Schedule audit training session',
      'Prepare audit checklists',
      'Coordinate with clinical departments',
      'Set up audit documentation system'
    ],
    compliance: 0,
    samplesReviewed: 0,
    totalSamples: 200,
    nabhStandard: 'MOM.1',
    priority: 'Medium',
    createdAt: '2026-01-25',
    lastUpdated: '2026-02-01',
    documentsLink: '', // Ready for Google Docs link
  },
  {
    id: 'audit5',
    title: 'Patient Identification Audit',
    description: 'Critical patient safety audit to ensure proper patient identification protocols',
    category: 'Patient Safety',
    auditType: 'Internal', 
    department: 'Quality Department',
    auditor: 'Sonali',
    startDate: '2026-02-04',
    status: 'Planned',
    frequency: 'Monthly',
    criteria: [
      'Patient wristband present with 2 identifiers (Name + UHID)',
      'Staff verify patient identity before medication administration',
      'Staff verify patient identity before procedures',
      'Wristband information matches medical records',
      'Missing/damaged bands replaced immediately'
    ],
    findings: [],
    recommendations: [],
    actionItems: [
      'Conduct systematic check of all admitted patients',
      'Replace any missing or damaged identification bands',
      'Train staff on proper verification protocols',
      'Document non-compliance and corrective actions'
    ],
    compliance: 0,
    samplesReviewed: 0,
    totalSamples: 100,
    nabhStandard: 'PSQ.1',
    priority: 'High',
    followUpDate: '2026-02-10',
    createdAt: '2026-02-03',
    lastUpdated: '2026-02-03',
    documentsLink: '', // Ready for Google Docs link
  },
];

export default function ClinicalAuditsMasterPage() {
  const [audits, setAudits] = useState<ClinicalAudit[]>(DEFAULT_AUDITS);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState<ClinicalAudit | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Form state
  const [auditForm, setAuditForm] = useState<Partial<ClinicalAudit>>({
    title: '',
    description: '',
    category: 'Patient Safety',
    auditType: 'Internal',
    department: '',
    auditor: '',
    startDate: '',
    completionDate: '',
    status: 'Planned',
    frequency: 'Quarterly',
    compliance: 0,
    samplesReviewed: 0,
    totalSamples: 0,
    priority: 'Medium',
  });

  const [criteriaText, setCriteriaText] = useState('');
  const [findingsText, setFindingsText] = useState('');
  const [recommendationsText, setRecommendationsText] = useState('');
  const [actionItemsText, setActionItemsText] = useState('');

  const handleAddAudit = () => {
    const newAudit: ClinicalAudit = {
      id: `audit_${Date.now()}`,
      ...(auditForm as Omit<ClinicalAudit, 'id'>),
      criteria: criteriaText.split('\n').filter(item => item.trim()),
      findings: findingsText.split('\n').filter(item => item.trim()),
      recommendations: recommendationsText.split('\n').filter(item => item.trim()),
      actionItems: actionItemsText.split('\n').filter(item => item.trim()),
      createdAt: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    setAudits([...audits, newAudit]);
    resetForm();
    setIsAddDialogOpen(false);
    setSnackbar({ open: true, message: 'Clinical audit added successfully', severity: 'success' });
  };

  const handleEditAudit = (audit: ClinicalAudit) => {
    setAuditForm(audit);
    setCriteriaText(audit.criteria.join('\n'));
    setFindingsText(audit.findings.join('\n'));
    setRecommendationsText(audit.recommendations.join('\n'));
    setActionItemsText(audit.actionItems.join('\n'));
    setSelectedAudit(audit);
    setIsEditDialogOpen(true);
    setMenuAnchor(null);
  };

  const handleUpdateAudit = () => {
    if (!selectedAudit) return;

    const updatedAudit: ClinicalAudit = {
      ...selectedAudit,
      ...auditForm,
      criteria: criteriaText.split('\n').filter(item => item.trim()),
      findings: findingsText.split('\n').filter(item => item.trim()),
      recommendations: recommendationsText.split('\n').filter(item => item.trim()),
      actionItems: actionItemsText.split('\n').filter(item => item.trim()),
      lastUpdated: new Date().toISOString().split('T')[0],
    } as ClinicalAudit;

    setAudits(audits.map(a => a.id === selectedAudit.id ? updatedAudit : a));
    resetForm();
    setIsEditDialogOpen(false);
    setSnackbar({ open: true, message: 'Clinical audit updated successfully', severity: 'success' });
  };

  const handleDeleteAudit = (audit: ClinicalAudit) => {
    setSelectedAudit(audit);
    setIsDeleteDialogOpen(true);
    setMenuAnchor(null);
  };

  const handleConfirmDelete = () => {
    if (!selectedAudit) return;
    
    setAudits(audits.filter(a => a.id !== selectedAudit.id));
    setIsDeleteDialogOpen(false);
    setSnackbar({ open: true, message: 'Clinical audit deleted successfully', severity: 'success' });
  };

  const resetForm = () => {
    setAuditForm({
      title: '',
      description: '',
      category: 'Patient Safety',
      auditType: 'Internal',
      department: '',
      auditor: '',
      startDate: '',
      completionDate: '',
      status: 'Planned',
      frequency: 'Quarterly',
      compliance: 0,
      samplesReviewed: 0,
      totalSamples: 0,
      priority: 'Medium',
    });
    setCriteriaText('');
    setFindingsText('');
    setRecommendationsText('');
    setActionItemsText('');
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, audit: ClinicalAudit) => {
    setMenuAnchor(event.currentTarget);
    setSelectedAudit(audit);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'primary';
      case 'Planned': return 'info';
      case 'Overdue': return 'error';
      case 'Cancelled': return 'default';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Patient Safety': return '🛡️';
      case 'Quality Indicators': return '📊';
      case 'Infection Control': return '🧼';
      case 'Medication Safety': return '💊';
      case 'Documentation': return '📋';
      case 'Compliance': return '✅';
      default: return '🔍';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <AuditIcon sx={{ color: 'primary.main', fontSize: 32 }} />
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Clinical Audits Master
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Manage all clinical audits and quality assessments
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsAddDialogOpen(true)}
        >
          Add Clinical Audit
        </Button>
      </Box>

      {/* Stats */}
      <Box display="flex" gap={2} mb={4} flexWrap="wrap">
        <Card sx={{ minWidth: 200 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h3" color="primary" fontWeight="bold">
              {audits.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Audits
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h3" color="success.main" fontWeight="bold">
              {audits.filter(a => a.status === 'Completed').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Completed
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h3" color="warning.main" fontWeight="bold">
              {audits.filter(a => a.status === 'In Progress').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              In Progress
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h3" color="info.main" fontWeight="bold">
              {Math.round(audits.filter(a => a.compliance > 0).reduce((acc, a) => acc + a.compliance, 0) / audits.filter(a => a.compliance > 0).length || 0)}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Avg Compliance
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Audits Grid */}
      <Box display="flex" gap={3} flexWrap="wrap">
        {audits.map(audit => (
          <Box flex="1" minWidth="400px" key={audit.id}>
            <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body1" sx={{ fontSize: '1.5em' }}>
                      {getCategoryIcon(audit.category)}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {audit.title}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Chip 
                      label={audit.priority} 
                      size="small" 
                      color={getPriorityColor(audit.priority) as any}
                    />
                    <Chip 
                      label={audit.status} 
                      size="small" 
                      color={getStatusColor(audit.status) as any}
                    />
                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, audit)}>
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" mb={2}>
                  {audit.description}
                </Typography>

                <Box mb={2}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    <TrendingUpIcon sx={{ fontSize: 14, mr: 0.5 }} />
                    {audit.auditor} • {audit.department} • {audit.auditType}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    <ScheduleIcon sx={{ fontSize: 14, mr: 0.5 }} />
                    {audit.frequency} • Started: {new Date(audit.startDate).toLocaleDateString()}
                    {audit.completionDate && ` • Completed: ${new Date(audit.completionDate).toLocaleDateString()}`}
                  </Typography>
                  {audit.nabhStandard && (
                    <Typography variant="caption" color="primary" display="block">
                      NABH Standard: {audit.nabhStandard}
                    </Typography>
                  )}
                </Box>

                {audit.compliance > 0 && (
                  <Box mb={2}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                      <Typography variant="subtitle2">Compliance</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {audit.compliance}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={audit.compliance} 
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                      {audit.samplesReviewed} of {audit.totalSamples} samples reviewed
                    </Typography>
                  </Box>
                )}

                {audit.findings.length > 0 && (
                  <Box mb={2}>
                    <Typography variant="subtitle2" gutterBottom>Key Findings:</Typography>
                    {audit.findings.slice(0, 2).map((finding, index) => (
                      <Typography key={index} variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                        • {finding}
                      </Typography>
                    ))}
                    {audit.findings.length > 2 && (
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                        +{audit.findings.length - 2} more findings
                      </Typography>
                    )}
                  </Box>
                )}

                {audit.recommendations.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>Recommendations:</Typography>
                    {audit.recommendations.slice(0, 2).map((rec, index) => (
                      <Typography key={index} variant="body2" color="info.main" sx={{ fontSize: '0.85rem' }}>
                        ➤ {rec}
                      </Typography>
                    ))}
                    {audit.recommendations.length > 2 && (
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                        +{audit.recommendations.length - 2} more recommendations
                      </Typography>
                    )}
                  </Box>
                )}

                {/* Documents Link Section */}
                <Box sx={{ mt: 2 }}>
                  <Box display="flex" alignItems="center" gap={0.5} mb={1}>
                    <TrendingUpIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                    <Typography variant="caption" fontWeight="medium" color="text.secondary">
                      Audit Documents:
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Google Docs/Sheets link..."
                      value={audit.documentsLink || ''}
                      onChange={(e) => {
                        const updatedAudit = { ...audit, documentsLink: e.target.value };
                        setAudits(audits.map(a => a.id === audit.id ? updatedAudit : a));
                      }}
                      variant="outlined"
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          fontSize: '0.75rem',
                          height: '32px',
                        }
                      }}
                    />
                    {audit.documentsLink && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => window.open(audit.documentsLink, '_blank')}
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
        <MenuItem onClick={() => selectedAudit && handleEditAudit(selectedAudit)}>
          <EditIcon sx={{ mr: 1 }} />
          Edit Audit
        </MenuItem>
        <MenuItem 
          onClick={() => selectedAudit && handleDeleteAudit(selectedAudit)}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ mr: 1 }} />
          Delete Audit
        </MenuItem>
      </Menu>

      {/* Add Audit Dialog */}
      <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Add New Clinical Audit</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Audit Title"
              fullWidth
              value={auditForm.title || ''}
              onChange={(e) => setAuditForm({ ...auditForm, title: e.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={auditForm.description || ''}
              onChange={(e) => setAuditForm({ ...auditForm, description: e.target.value })}
            />
            <Box display="flex" gap={2}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={auditForm.category || 'Patient Safety'}
                  onChange={(e) => setAuditForm({ ...auditForm, category: e.target.value as any })}
                >
                  <MenuItem value="Patient Safety">Patient Safety</MenuItem>
                  <MenuItem value="Quality Indicators">Quality Indicators</MenuItem>
                  <MenuItem value="Infection Control">Infection Control</MenuItem>
                  <MenuItem value="Medication Safety">Medication Safety</MenuItem>
                  <MenuItem value="Documentation">Documentation</MenuItem>
                  <MenuItem value="Compliance">Compliance</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Audit Type</InputLabel>
                <Select
                  value={auditForm.auditType || 'Internal'}
                  onChange={(e) => setAuditForm({ ...auditForm, auditType: e.target.value as any })}
                >
                  <MenuItem value="Internal">Internal</MenuItem>
                  <MenuItem value="External">External</MenuItem>
                  <MenuItem value="Self Assessment">Self Assessment</MenuItem>
                  <MenuItem value="Peer Review">Peer Review</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box display="flex" gap={2}>
              <TextField
                label="Department"
                fullWidth
                value={auditForm.department || ''}
                onChange={(e) => setAuditForm({ ...auditForm, department: e.target.value })}
              />
              <TextField
                label="Auditor"
                fullWidth
                value={auditForm.auditor || ''}
                onChange={(e) => setAuditForm({ ...auditForm, auditor: e.target.value })}
              />
            </Box>
            <Box display="flex" gap={2}>
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                value={auditForm.startDate || ''}
                onChange={(e) => setAuditForm({ ...auditForm, startDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Completion Date"
                type="date"
                fullWidth
                value={auditForm.completionDate || ''}
                onChange={(e) => setAuditForm({ ...auditForm, completionDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box display="flex" gap={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={auditForm.status || 'Planned'}
                  onChange={(e) => setAuditForm({ ...auditForm, status: e.target.value as any })}
                >
                  <MenuItem value="Planned">Planned</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Overdue">Overdue</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Frequency</InputLabel>
                <Select
                  value={auditForm.frequency || 'Quarterly'}
                  onChange={(e) => setAuditForm({ ...auditForm, frequency: e.target.value as any })}
                >
                  <MenuItem value="Monthly">Monthly</MenuItem>
                  <MenuItem value="Quarterly">Quarterly</MenuItem>
                  <MenuItem value="Half-yearly">Half-yearly</MenuItem>
                  <MenuItem value="Yearly">Yearly</MenuItem>
                  <MenuItem value="One-time">One-time</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box display="flex" gap={2}>
              <TextField
                label="Samples Reviewed"
                type="number"
                fullWidth
                value={auditForm.samplesReviewed || ''}
                onChange={(e) => setAuditForm({ ...auditForm, samplesReviewed: parseInt(e.target.value) || 0 })}
              />
              <TextField
                label="Total Samples"
                type="number"
                fullWidth
                value={auditForm.totalSamples || ''}
                onChange={(e) => setAuditForm({ ...auditForm, totalSamples: parseInt(e.target.value) || 0 })}
              />
              <TextField
                label="Compliance %"
                type="number"
                fullWidth
                value={auditForm.compliance || ''}
                onChange={(e) => setAuditForm({ ...auditForm, compliance: parseInt(e.target.value) || 0 })}
                inputProps={{ min: 0, max: 100 }}
              />
            </Box>
            <Box display="flex" gap={2}>
              <TextField
                label="NABH Standard (optional)"
                fullWidth
                value={auditForm.nabhStandard || ''}
                onChange={(e) => setAuditForm({ ...auditForm, nabhStandard: e.target.value })}
                placeholder="e.g., PCC.1, HIC.2"
              />
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={auditForm.priority || 'Medium'}
                  onChange={(e) => setAuditForm({ ...auditForm, priority: e.target.value as any })}
                >
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <TextField
              label="Audit Criteria (one per line)"
              fullWidth
              multiline
              rows={4}
              value={criteriaText}
              onChange={(e) => setCriteriaText(e.target.value)}
            />
            <TextField
              label="Findings (one per line)"
              fullWidth
              multiline
              rows={3}
              value={findingsText}
              onChange={(e) => setFindingsText(e.target.value)}
            />
            <TextField
              label="Recommendations (one per line)"
              fullWidth
              multiline
              rows={3}
              value={recommendationsText}
              onChange={(e) => setRecommendationsText(e.target.value)}
            />
            <TextField
              label="Action Items (one per line)"
              fullWidth
              multiline
              rows={3}
              value={actionItemsText}
              onChange={(e) => setActionItemsText(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setIsAddDialogOpen(false); resetForm(); }}>Cancel</Button>
          <Button variant="contained" onClick={handleAddAudit}>Add Audit</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Audit Dialog */}
      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Edit Clinical Audit</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Audit Title"
              fullWidth
              value={auditForm.title || ''}
              onChange={(e) => setAuditForm({ ...auditForm, title: e.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={auditForm.description || ''}
              onChange={(e) => setAuditForm({ ...auditForm, description: e.target.value })}
            />
            <Box display="flex" gap={2}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={auditForm.category || 'Patient Safety'}
                  onChange={(e) => setAuditForm({ ...auditForm, category: e.target.value as any })}
                >
                  <MenuItem value="Patient Safety">Patient Safety</MenuItem>
                  <MenuItem value="Quality Indicators">Quality Indicators</MenuItem>
                  <MenuItem value="Infection Control">Infection Control</MenuItem>
                  <MenuItem value="Medication Safety">Medication Safety</MenuItem>
                  <MenuItem value="Documentation">Documentation</MenuItem>
                  <MenuItem value="Compliance">Compliance</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Audit Type</InputLabel>
                <Select
                  value={auditForm.auditType || 'Internal'}
                  onChange={(e) => setAuditForm({ ...auditForm, auditType: e.target.value as any })}
                >
                  <MenuItem value="Internal">Internal</MenuItem>
                  <MenuItem value="External">External</MenuItem>
                  <MenuItem value="Self Assessment">Self Assessment</MenuItem>
                  <MenuItem value="Peer Review">Peer Review</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box display="flex" gap={2}>
              <TextField
                label="Department"
                fullWidth
                value={auditForm.department || ''}
                onChange={(e) => setAuditForm({ ...auditForm, department: e.target.value })}
              />
              <TextField
                label="Auditor"
                fullWidth
                value={auditForm.auditor || ''}
                onChange={(e) => setAuditForm({ ...auditForm, auditor: e.target.value })}
              />
            </Box>
            <Box display="flex" gap={2}>
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                value={auditForm.startDate || ''}
                onChange={(e) => setAuditForm({ ...auditForm, startDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Completion Date"
                type="date"
                fullWidth
                value={auditForm.completionDate || ''}
                onChange={(e) => setAuditForm({ ...auditForm, completionDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box display="flex" gap={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={auditForm.status || 'Planned'}
                  onChange={(e) => setAuditForm({ ...auditForm, status: e.target.value as any })}
                >
                  <MenuItem value="Planned">Planned</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Overdue">Overdue</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Frequency</InputLabel>
                <Select
                  value={auditForm.frequency || 'Quarterly'}
                  onChange={(e) => setAuditForm({ ...auditForm, frequency: e.target.value as any })}
                >
                  <MenuItem value="Monthly">Monthly</MenuItem>
                  <MenuItem value="Quarterly">Quarterly</MenuItem>
                  <MenuItem value="Half-yearly">Half-yearly</MenuItem>
                  <MenuItem value="Yearly">Yearly</MenuItem>
                  <MenuItem value="One-time">One-time</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box display="flex" gap={2}>
              <TextField
                label="Samples Reviewed"
                type="number"
                fullWidth
                value={auditForm.samplesReviewed || ''}
                onChange={(e) => setAuditForm({ ...auditForm, samplesReviewed: parseInt(e.target.value) || 0 })}
              />
              <TextField
                label="Total Samples"
                type="number"
                fullWidth
                value={auditForm.totalSamples || ''}
                onChange={(e) => setAuditForm({ ...auditForm, totalSamples: parseInt(e.target.value) || 0 })}
              />
              <TextField
                label="Compliance %"
                type="number"
                fullWidth
                value={auditForm.compliance || ''}
                onChange={(e) => setAuditForm({ ...auditForm, compliance: parseInt(e.target.value) || 0 })}
                inputProps={{ min: 0, max: 100 }}
              />
            </Box>
            <Box display="flex" gap={2}>
              <TextField
                label="NABH Standard (optional)"
                fullWidth
                value={auditForm.nabhStandard || ''}
                onChange={(e) => setAuditForm({ ...auditForm, nabhStandard: e.target.value })}
                placeholder="e.g., PCC.1, HIC.2"
              />
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={auditForm.priority || 'Medium'}
                  onChange={(e) => setAuditForm({ ...auditForm, priority: e.target.value as any })}
                >
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <TextField
              label="Audit Criteria (one per line)"
              fullWidth
              multiline
              rows={4}
              value={criteriaText}
              onChange={(e) => setCriteriaText(e.target.value)}
            />
            <TextField
              label="Findings (one per line)"
              fullWidth
              multiline
              rows={3}
              value={findingsText}
              onChange={(e) => setFindingsText(e.target.value)}
            />
            <TextField
              label="Recommendations (one per line)"
              fullWidth
              multiline
              rows={3}
              value={recommendationsText}
              onChange={(e) => setRecommendationsText(e.target.value)}
            />
            <TextField
              label="Action Items (one per line)"
              fullWidth
              multiline
              rows={3}
              value={actionItemsText}
              onChange={(e) => setActionItemsText(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setIsEditDialogOpen(false); resetForm(); }}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateAudit}>Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Delete Clinical Audit</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{selectedAudit?.title}</strong>?
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
            Delete Audit
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
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
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Gavel as LicenseIcon,
  Warning as WarningIcon,
  CheckCircle as ValidIcon,
  Schedule as ExpiringIcon,
  Error as ExpiredIcon,
} from '@mui/icons-material';

interface License {
  id: string;
  name: string;
  category: 'Medical' | 'Fire Safety' | 'Environmental' | 'Building' | 'Business' | 'Equipment' | 'Professional' | 'Other';
  licenseNumber: string;
  issuingAuthority: string;
  issueDate: string;
  expiryDate: string;
  validityPeriod: string; // e.g., "5 Years", "Annual", "Permanent"
  status: 'Valid' | 'Expiring Soon' | 'Expired' | 'Under Renewal';
  description: string;
  attachedDocument?: string;
  renewalProcess: string;
  responsiblePerson: string;
  reminderDays: number; // Days before expiry to send reminder
  lastRenewalDate?: string;
  renewalCost?: string;
  documentsLink?: string; // Google Docs/Sheets link
  createdAt: string;
  updatedAt: string;
}

// Comprehensive list of licenses and statutory requirements for Hope Hospital
const DEFAULT_LICENSES: License[] = [
  // MEDICAL LICENSES
  {
    id: 'med_001',
    name: 'Hospital Registration Certificate',
    category: 'Medical',
    licenseNumber: 'HOPE/REG/2024/001',
    issuingAuthority: 'Directorate of Health Services, Maharashtra',
    issueDate: '2024-01-15',
    expiryDate: '2029-01-14',
    validityPeriod: '5 Years',
    status: 'Valid',
    description: 'Primary hospital registration certificate under Maharashtra Nursing Homes Registration Act',
    renewalProcess: 'Submit renewal application 3 months before expiry with updated documents',
    responsiblePerson: 'Dr. Murali BK',
    reminderDays: 90,
    renewalCost: '₹50,000',
    documentsLink: '',
    createdAt: '2026-02-03T10:00:00.000Z',
    updatedAt: '2026-02-03T10:00:00.000Z',
  },
  {
    id: 'med_002',
    name: 'Clinical Establishment License',
    category: 'Medical',
    licenseNumber: 'CEA/HOPE/2024/015',
    issuingAuthority: 'Clinical Establishments Authority, Maharashtra',
    issueDate: '2024-02-01',
    expiryDate: '2027-01-31',
    validityPeriod: '3 Years',
    status: 'Valid',
    description: 'Clinical Establishment Act license for medical practice and patient care',
    renewalProcess: 'Online application through CEA portal with compliance certificate',
    responsiblePerson: 'Viji Murali',
    reminderDays: 90,
    renewalCost: '₹25,000',
    documentsLink: '',
    createdAt: '2026-02-03T10:00:00.000Z',
    updatedAt: '2026-02-03T10:00:00.000Z',
  },
  {
    id: 'med_003',
    name: 'Drug License (Retail)',
    category: 'Medical',
    licenseNumber: 'DL/HOPE/2024/R/032',
    issuingAuthority: 'Food & Drug Administration, Maharashtra',
    issueDate: '2024-04-01',
    expiryDate: '2026-03-31',
    validityPeriod: '2 Years',
    status: 'Expiring Soon',
    description: 'Drug license for retail sale and dispensing of medicines',
    renewalProcess: 'Submit Form 19 with inspection certificate and fees',
    responsiblePerson: 'Abhishek (Pharmacist)',
    reminderDays: 60,
    renewalCost: '₹15,000',
    documentsLink: '',
    createdAt: '2026-02-03T10:00:00.000Z',
    updatedAt: '2026-02-03T10:00:00.000Z',
  },
  {
    id: 'med_004',
    name: 'X-Ray License',
    category: 'Medical',
    licenseNumber: 'RAD/HOPE/2024/009',
    issuingAuthority: 'Atomic Energy Regulatory Board (AERB)',
    issueDate: '2024-03-15',
    expiryDate: '2027-03-14',
    validityPeriod: '3 Years',
    status: 'Valid',
    description: 'Radiation safety license for X-ray and imaging equipment operation',
    renewalProcess: 'AERB inspection and compliance certificate required',
    responsiblePerson: 'Nitin Bawane (Radiology Technician)',
    reminderDays: 120,
    renewalCost: '₹30,000',
    documentsLink: '',
    createdAt: '2026-02-03T10:00:00.000Z',
    updatedAt: '2026-02-03T10:00:00.000Z',
  },
  {
    id: 'med_005',
    name: 'Biomedical Waste Authorization',
    category: 'Medical',
    licenseNumber: 'BMW/HOPE/2024/045',
    issuingAuthority: 'Maharashtra Pollution Control Board',
    issueDate: '2024-01-01',
    expiryDate: '2026-12-31',
    validityPeriod: '3 Years',
    status: 'Valid',
    description: 'Authorization for biomedical waste generation, collection, and disposal',
    renewalProcess: 'Annual returns submission and triennial renewal with MPCB',
    responsiblePerson: 'Shilpi (Infection Control Nurse)',
    reminderDays: 90,
    renewalCost: '₹20,000',
    documentsLink: '',
    createdAt: '2026-02-03T10:00:00.000Z',
    updatedAt: '2026-02-03T10:00:00.000Z',
  },

  // FIRE SAFETY LICENSES
  {
    id: 'fire_001',
    name: 'Fire Safety Certificate',
    category: 'Fire Safety',
    licenseNumber: 'FSC/HOPE/2024/078',
    issuingAuthority: 'Chief Fire Officer, Nagpur',
    issueDate: '2024-06-15',
    expiryDate: '2025-06-14',
    validityPeriod: '1 Year',
    status: 'Expiring Soon',
    description: 'Fire safety compliance certificate for hospital building and operations',
    renewalProcess: 'Annual inspection by Fire Department with compliance report',
    responsiblePerson: 'Suraj Rajput (Infrastructure)',
    reminderDays: 45,
    renewalCost: '₹10,000',
    documentsLink: '',
    createdAt: '2026-02-03T10:00:00.000Z',
    updatedAt: '2026-02-03T10:00:00.000Z',
  },
  {
    id: 'fire_002',
    name: 'Fire NOC for Building',
    category: 'Fire Safety',
    licenseNumber: 'NOC/FIRE/2023/234',
    issuingAuthority: 'Fire Department, Nagpur Municipal Corporation',
    issueDate: '2023-08-20',
    expiryDate: '2026-08-19',
    validityPeriod: '3 Years',
    status: 'Valid',
    description: 'Fire No Objection Certificate for hospital building construction and use',
    renewalProcess: 'Building compliance inspection and structural fire safety audit',
    responsiblePerson: 'Suraj Rajput (Infrastructure)',
    reminderDays: 90,
    renewalCost: '₹25,000',
    documentsLink: '',
    createdAt: '2026-02-03T10:00:00.000Z',
    updatedAt: '2026-02-03T10:00:00.000Z',
  },

  // ENVIRONMENTAL LICENSES
  {
    id: 'env_001',
    name: 'Air Pollution Consent',
    category: 'Environmental',
    licenseNumber: 'AIR/HOPE/2024/089',
    issuingAuthority: 'Maharashtra Pollution Control Board',
    issueDate: '2024-01-10',
    expiryDate: '2026-01-09',
    validityPeriod: '2 Years',
    status: 'Valid',
    description: 'Consent for air pollution activities including DG set and incinerator operation',
    renewalProcess: 'Annual environmental compliance report and stack monitoring',
    responsiblePerson: 'Suraj Rajput (Infrastructure)',
    reminderDays: 60,
    renewalCost: '₹15,000',
    documentsLink: '',
    createdAt: '2026-02-03T10:00:00.000Z',
    updatedAt: '2026-02-03T10:00:00.000Z',
  },
  {
    id: 'env_002',
    name: 'Water Pollution Consent',
    category: 'Environmental',
    licenseNumber: 'WATER/HOPE/2024/067',
    issuingAuthority: 'Maharashtra Pollution Control Board',
    issueDate: '2024-02-15',
    expiryDate: '2026-02-14',
    validityPeriod: '2 Years',
    status: 'Valid',
    description: 'Consent for water pollution activities and wastewater discharge',
    renewalProcess: 'Water quality monitoring reports and compliance certificate',
    responsiblePerson: 'Suraj Rajput (Infrastructure)',
    reminderDays: 60,
    renewalCost: '₹12,000',
    documentsLink: '',
    createdAt: '2026-02-03T10:00:00.000Z',
    updatedAt: '2026-02-03T10:00:00.000Z',
  },

  // BUILDING LICENSES
  {
    id: 'build_001',
    name: 'Building Use Permission',
    category: 'Building',
    licenseNumber: 'BUP/HOPE/2023/156',
    issuingAuthority: 'Nagpur Municipal Corporation',
    issueDate: '2023-12-01',
    expiryDate: 'Permanent',
    validityPeriod: 'Permanent',
    status: 'Valid',
    description: 'Building use permission for hospital and medical facility operations',
    renewalProcess: 'Structural audit every 10 years for buildings above 15 years',
    responsiblePerson: 'Dr. Murali BK',
    reminderDays: 365,
    renewalCost: 'N/A',
    documentsLink: '',
    createdAt: '2026-02-03T10:00:00.000Z',
    updatedAt: '2026-02-03T10:00:00.000Z',
  },
  {
    id: 'build_002',
    name: 'Lift Safety Certificate',
    category: 'Building',
    licenseNumber: 'LIFT/HOPE/2024/023',
    issuingAuthority: 'Directorate of Industrial Safety & Health',
    issueDate: '2024-07-01',
    expiryDate: '2025-06-30',
    validityPeriod: '1 Year',
    status: 'Expiring Soon',
    description: 'Annual lift safety inspection and operation certificate',
    renewalProcess: 'Annual inspection by registered lift inspector',
    responsiblePerson: 'Suraj Rajput (Infrastructure)',
    reminderDays: 30,
    renewalCost: '₹8,000',
    documentsLink: '',
    createdAt: '2026-02-03T10:00:00.000Z',
    updatedAt: '2026-02-03T10:00:00.000Z',
  },

  // BUSINESS LICENSES
  {
    id: 'bus_001',
    name: 'GST Registration Certificate',
    category: 'Business',
    licenseNumber: '27AABCH1234C1Z5',
    issuingAuthority: 'Goods & Services Tax Department',
    issueDate: '2023-07-01',
    expiryDate: 'Permanent',
    validityPeriod: 'Permanent',
    status: 'Valid',
    description: 'GST registration for hospital services and medical equipment',
    renewalProcess: 'Annual returns filing and quarterly compliance',
    responsiblePerson: 'K J Shashank (HR & Finance)',
    reminderDays: 30,
    renewalCost: 'N/A',
    documentsLink: '',
    createdAt: '2026-02-03T10:00:00.000Z',
    updatedAt: '2026-02-03T10:00:00.000Z',
  },
  {
    id: 'bus_002',
    name: 'Professional Tax Registration',
    category: 'Business',
    licenseNumber: 'PT/HOPE/2024/891',
    issuingAuthority: 'Commercial Tax Department, Maharashtra',
    issueDate: '2024-04-01',
    expiryDate: '2025-03-31',
    validityPeriod: '1 Year',
    status: 'Valid',
    description: 'Professional tax registration for hospital and staff',
    renewalProcess: 'Annual renewal with payment of professional tax',
    responsiblePerson: 'K J Shashank (HR & Finance)',
    reminderDays: 45,
    renewalCost: '₹2,500',
    documentsLink: '',
    createdAt: '2026-02-03T10:00:00.000Z',
    updatedAt: '2026-02-03T10:00:00.000Z',
  },
  {
    id: 'bus_003',
    name: 'ESI Registration',
    category: 'Business',
    licenseNumber: '40000123456789000',
    issuingAuthority: 'Employees State Insurance Corporation',
    issueDate: '2023-08-15',
    expiryDate: 'Permanent',
    validityPeriod: 'Permanent',
    status: 'Valid',
    description: 'ESI registration for employee medical benefits and insurance',
    renewalProcess: 'Monthly contribution and annual compliance',
    responsiblePerson: 'K J Shashank (HR & Finance)',
    reminderDays: 30,
    renewalCost: 'Monthly Contribution',
    documentsLink: '',
    createdAt: '2026-02-03T10:00:00.000Z',
    updatedAt: '2026-02-03T10:00:00.000Z',
  },
  {
    id: 'bus_004',
    name: 'PF Registration',
    category: 'Business',
    licenseNumber: 'MH/NGP/0012345/000',
    issuingAuthority: 'Employees Provident Fund Organisation',
    issueDate: '2023-08-15',
    expiryDate: 'Permanent',
    validityPeriod: 'Permanent',
    status: 'Valid',
    description: 'Provident Fund registration for employee retirement benefits',
    renewalProcess: 'Monthly PF contribution and annual compliance',
    responsiblePerson: 'K J Shashank (HR & Finance)',
    reminderDays: 30,
    renewalCost: 'Monthly Contribution',
    documentsLink: '',
    createdAt: '2026-02-03T10:00:00.000Z',
    updatedAt: '2026-02-03T10:00:00.000Z',
  },

  // PROFESSIONAL LICENSES
  {
    id: 'prof_001',
    name: 'Dr. Murali BK - Medical Registration',
    category: 'Professional',
    licenseNumber: 'MCI-12345-2020',
    issuingAuthority: 'Maharashtra Medical Council',
    issueDate: '2020-01-15',
    expiryDate: '2025-01-14',
    validityPeriod: '5 Years',
    status: 'Expiring Soon',
    description: 'Medical Council registration for Dr. Murali BK - Orthopedic Surgeon',
    renewalProcess: 'CME credits completion and renewal application',
    responsiblePerson: 'Dr. Murali BK',
    reminderDays: 90,
    renewalCost: '₹5,000',
    documentsLink: '',
    createdAt: '2026-02-03T10:00:00.000Z',
    updatedAt: '2026-02-03T10:00:00.000Z',
  },
  {
    id: 'prof_002',
    name: 'Dr. Ruby Ammon - Medical Registration',
    category: 'Professional',
    licenseNumber: 'MCI-67890-2018',
    issuingAuthority: 'Maharashtra Medical Council',
    issueDate: '2018-03-20',
    expiryDate: '2026-03-19',
    validityPeriod: '5 Years',
    status: 'Valid',
    description: 'Medical Council registration for Dr. Ruby Ammon - Medical Director',
    renewalProcess: 'CME credits completion and renewal application',
    responsiblePerson: 'Dr. Ruby Ammon',
    reminderDays: 90,
    renewalCost: '₹5,000',
    documentsLink: '',
    createdAt: '2026-02-03T10:00:00.000Z',
    updatedAt: '2026-02-03T10:00:00.000Z',
  },

  // EQUIPMENT LICENSES
  {
    id: 'equip_001',
    name: 'Boiler Inspection Certificate',
    category: 'Equipment',
    licenseNumber: 'BOILER/HOPE/2024/007',
    issuingAuthority: 'Chief Inspector of Boilers, Maharashtra',
    issueDate: '2024-09-01',
    expiryDate: '2025-08-31',
    validityPeriod: '1 Year',
    status: 'Valid',
    description: 'Annual boiler inspection and safety certificate for steam sterilization',
    renewalProcess: 'Annual inspection by registered boiler inspector',
    responsiblePerson: 'Suraj Rajput (Infrastructure)',
    reminderDays: 45,
    renewalCost: '₹12,000',
    documentsLink: '',
    createdAt: '2026-02-03T10:00:00.000Z',
    updatedAt: '2026-02-03T10:00:00.000Z',
  },
];

export default function LicensesMasterPage() {
  const [licenses, setLicenses] = useState<License[]>(DEFAULT_LICENSES);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Form state for new/edit license
  const [licenseForm, setLicenseForm] = useState<Partial<License>>({
    name: '',
    category: 'Medical',
    licenseNumber: '',
    issuingAuthority: '',
    issueDate: '',
    expiryDate: '',
    validityPeriod: '',
    status: 'Valid',
    description: '',
    renewalProcess: '',
    responsiblePerson: '',
    reminderDays: 60,
    renewalCost: '',
    documentsLink: '',
  });

  const getStatusColor = (status: License['status']) => {
    switch (status) {
      case 'Valid': return 'success';
      case 'Expiring Soon': return 'warning';
      case 'Expired': return 'error';
      case 'Under Renewal': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: License['status']) => {
    switch (status) {
      case 'Valid': return <ValidIcon />;
      case 'Expiring Soon': return <ExpiringIcon />;
      case 'Expired': return <ExpiredIcon />;
      case 'Under Renewal': return <WarningIcon />;
      default: return <LicenseIcon />;
    }
  };

  const getCategoryIcon = (category: License['category']) => {
    switch (category) {
      case 'Medical': return 'medical_services';
      case 'Fire Safety': return 'local_fire_department';
      case 'Environmental': return 'eco';
      case 'Building': return 'apartment';
      case 'Business': return 'business';
      case 'Equipment': return 'precision_manufacturing';
      case 'Professional': return 'badge';
      default: return 'description';
    }
  };

  const handleAddLicense = () => {
    const newLicense: License = {
      id: `license_${Date.now()}`,
      ...(licenseForm as Omit<License, 'id' | 'createdAt' | 'updatedAt'>),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setLicenses([...licenses, newLicense]);
    resetForm();
    setIsAddDialogOpen(false);
    setSnackbar({ open: true, message: 'License added successfully', severity: 'success' });
  };

  const handleEditLicense = (license: License) => {
    setSelectedLicense(license);
    setLicenseForm({ ...license });
    setIsEditDialogOpen(true);
    setMenuAnchor(null);
  };

  const handleSaveEdit = () => {
    if (!selectedLicense) return;

    const updatedLicense = {
      ...selectedLicense,
      ...licenseForm,
      updatedAt: new Date().toISOString(),
    };

    setLicenses(licenses.map(l => l.id === selectedLicense.id ? updatedLicense : l));
    setIsEditDialogOpen(false);
    resetForm();
    setSnackbar({ open: true, message: 'License updated successfully', severity: 'success' });
  };

  const handleDeleteLicense = (license: License) => {
    setSelectedLicense(license);
    setIsDeleteDialogOpen(true);
    setMenuAnchor(null);
  };

  const handleConfirmDelete = () => {
    if (!selectedLicense) return;

    setLicenses(licenses.filter(l => l.id !== selectedLicense.id));
    setIsDeleteDialogOpen(false);
    setSnackbar({ open: true, message: 'License deleted successfully', severity: 'success' });
  };

  const resetForm = () => {
    setLicenseForm({
      name: '',
      category: 'Medical',
      licenseNumber: '',
      issuingAuthority: '',
      issueDate: '',
      expiryDate: '',
      validityPeriod: '',
      status: 'Valid',
      description: '',
      renewalProcess: '',
      responsiblePerson: '',
      reminderDays: 60,
      renewalCost: '',
      documentsLink: '',
    });
    setSelectedLicense(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, license: License) => {
    setMenuAnchor(event.currentTarget);
    setSelectedLicense(license);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  // Calculate days until expiry
  const getDaysUntilExpiry = (expiryDate: string) => {
    if (expiryDate === 'Permanent') return Infinity;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Get statistics
  const totalLicenses = licenses.length;
  const validLicenses = licenses.filter(l => l.status === 'Valid').length;
  const expiringLicenses = licenses.filter(l => l.status === 'Expiring Soon').length;
  const expiredLicenses = licenses.filter(l => l.status === 'Expired').length;

  return (
    <Container maxWidth="xl">
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <LicenseIcon sx={{ color: 'primary.main', fontSize: 32 }} />
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Licenses & Statutory Requirements
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Track all licenses, certificates, and regulatory compliance with expiry monitoring
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsAddDialogOpen(true)}
        >
          Add License
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Box display="flex" gap={2} mb={4} flexWrap="wrap">
        <Box flex="1" minWidth="200px">
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="primary" fontWeight="bold">
                {totalLicenses}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Licenses
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box flex="1" minWidth="200px">
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="success.main" fontWeight="bold">
                {validLicenses}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Valid
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box flex="1" minWidth="200px">
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="warning.main" fontWeight="bold">
                {expiringLicenses}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Expiring Soon
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box flex="1" minWidth="200px">
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="error.main" fontWeight="bold">
                {expiredLicenses}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Expired
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Licenses Grid */}
      <Box display="flex" gap={3} flexWrap="wrap">
        {licenses.map(license => (
          <Box flex="1" minWidth="400px" key={license.id}>
            <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Icon sx={{ color: 'primary.main' }}>{getCategoryIcon(license.category)}</Icon>
                    <Typography variant="h6" fontWeight="bold">
                      {license.name}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Chip
                      icon={getStatusIcon(license.status)}
                      label={license.status}
                      color={getStatusColor(license.status)}
                      size="small"
                    />
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, license)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {license.description}
                </Typography>

                <Box sx={{ mt: 2, mb: 2 }}>
                  <Grid container spacing={1}>
                    <Grid size={6}>
                      <Typography variant="caption" display="block" color="text.secondary">
                        License Number:
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {license.licenseNumber}
                      </Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Issuing Authority:
                      </Typography>
                      <Typography variant="body2" fontWeight="medium" noWrap>
                        {license.issuingAuthority}
                      </Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Issue Date:
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {new Date(license.issueDate).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Expiry Date:
                      </Typography>
                      <Typography 
                        variant="body2" 
                        fontWeight="medium"
                        color={getDaysUntilExpiry(license.expiryDate) <= 60 ? 'error.main' : 'text.primary'}
                      >
                        {license.expiryDate === 'Permanent' 
                          ? 'Permanent' 
                          : new Date(license.expiryDate).toLocaleDateString()
                        }
                      </Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Responsible Person:
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {license.responsiblePerson}
                      </Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Renewal Cost:
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {license.renewalCost || 'N/A'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                {license.expiryDate !== 'Permanent' && (
                  <Box sx={{ mb: 2 }}>
                    {getDaysUntilExpiry(license.expiryDate) <= 0 ? (
                      <Alert severity="error" sx={{ fontSize: '0.75rem', py: 0.5 }}>
                        License has expired!
                      </Alert>
                    ) : getDaysUntilExpiry(license.expiryDate) <= 60 ? (
                      <Alert severity="warning" sx={{ fontSize: '0.75rem', py: 0.5 }}>
                        Expires in {getDaysUntilExpiry(license.expiryDate)} days
                      </Alert>
                    ) : (
                      <Alert severity="info" sx={{ fontSize: '0.75rem', py: 0.5 }}>
                        Valid for {getDaysUntilExpiry(license.expiryDate)} days
                      </Alert>
                    )}
                  </Box>
                )}

                {/* Google Docs Link Section */}
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
                      value={license.documentsLink || ''}
                      onChange={(e) => {
                        const updatedLicense = { ...license, documentsLink: e.target.value, updatedAt: new Date().toISOString() };
                        setLicenses(licenses.map(l => l.id === license.id ? updatedLicense : l));
                      }}
                      variant="outlined"
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          fontSize: '0.75rem',
                          height: '32px',
                        }
                      }}
                    />
                    {license.documentsLink && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => window.open(license.documentsLink, '_blank')}
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
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        <MenuItem onClick={() => selectedLicense && handleEditLicense(selectedLicense)}>
          <EditIcon sx={{ mr: 1 }} />
          Edit License
        </MenuItem>
        <MenuItem 
          onClick={() => selectedLicense && handleDeleteLicense(selectedLicense)}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ mr: 1 }} />
          Delete License
        </MenuItem>
      </Menu>

      {/* Add License Dialog */}
      <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New License</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="License/Certificate Name"
              value={licenseForm.name}
              onChange={(e) => setLicenseForm({ ...licenseForm, name: e.target.value })}
            />
            <Box display="flex" gap={2}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={licenseForm.category}
                  onChange={(e) => setLicenseForm({ ...licenseForm, category: e.target.value as License['category'] })}
                >
                  <MenuItem value="Medical">Medical</MenuItem>
                  <MenuItem value="Fire Safety">Fire Safety</MenuItem>
                  <MenuItem value="Environmental">Environmental</MenuItem>
                  <MenuItem value="Building">Building</MenuItem>
                  <MenuItem value="Business">Business</MenuItem>
                  <MenuItem value="Equipment">Equipment</MenuItem>
                  <MenuItem value="Professional">Professional</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="License Number"
                value={licenseForm.licenseNumber}
                onChange={(e) => setLicenseForm({ ...licenseForm, licenseNumber: e.target.value })}
              />
            </Box>
            <TextField
              fullWidth
              label="Issuing Authority"
              value={licenseForm.issuingAuthority}
              onChange={(e) => setLicenseForm({ ...licenseForm, issuingAuthority: e.target.value })}
            />
            <Box display="flex" gap={2}>
              <TextField
                fullWidth
                label="Issue Date"
                type="date"
                value={licenseForm.issueDate}
                onChange={(e) => setLicenseForm({ ...licenseForm, issueDate: e.target.value })}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                fullWidth
                label="Expiry Date"
                type="date"
                value={licenseForm.expiryDate}
                onChange={(e) => setLicenseForm({ ...licenseForm, expiryDate: e.target.value })}
                slotProps={{ inputLabel: { shrink: true } }}
                helperText="Leave empty for permanent licenses"
              />
            </Box>
            <Box display="flex" gap={2}>
              <TextField
                fullWidth
                label="Validity Period"
                value={licenseForm.validityPeriod}
                onChange={(e) => setLicenseForm({ ...licenseForm, validityPeriod: e.target.value })}
                placeholder="e.g., 1 Year, 5 Years, Permanent"
              />
              <TextField
                fullWidth
                label="Renewal Cost"
                value={licenseForm.renewalCost}
                onChange={(e) => setLicenseForm({ ...licenseForm, renewalCost: e.target.value })}
                placeholder="e.g., ₹25,000"
              />
            </Box>
            <TextField
              fullWidth
              label="Responsible Person"
              value={licenseForm.responsiblePerson}
              onChange={(e) => setLicenseForm({ ...licenseForm, responsiblePerson: e.target.value })}
            />
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Description"
              value={licenseForm.description}
              onChange={(e) => setLicenseForm({ ...licenseForm, description: e.target.value })}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Renewal Process"
              value={licenseForm.renewalProcess}
              onChange={(e) => setLicenseForm({ ...licenseForm, renewalProcess: e.target.value })}
              placeholder="Describe the renewal process and requirements"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddLicense}>Add License</Button>
        </DialogActions>
      </Dialog>

      {/* Edit License Dialog */}
      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit License</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="License/Certificate Name"
              value={licenseForm.name}
              onChange={(e) => setLicenseForm({ ...licenseForm, name: e.target.value })}
            />
            <Box display="flex" gap={2}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={licenseForm.category}
                  onChange={(e) => setLicenseForm({ ...licenseForm, category: e.target.value as License['category'] })}
                >
                  <MenuItem value="Medical">Medical</MenuItem>
                  <MenuItem value="Fire Safety">Fire Safety</MenuItem>
                  <MenuItem value="Environmental">Environmental</MenuItem>
                  <MenuItem value="Building">Building</MenuItem>
                  <MenuItem value="Business">Business</MenuItem>
                  <MenuItem value="Equipment">Equipment</MenuItem>
                  <MenuItem value="Professional">Professional</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="License Number"
                value={licenseForm.licenseNumber}
                onChange={(e) => setLicenseForm({ ...licenseForm, licenseNumber: e.target.value })}
              />
            </Box>
            <TextField
              fullWidth
              label="Issuing Authority"
              value={licenseForm.issuingAuthority}
              onChange={(e) => setLicenseForm({ ...licenseForm, issuingAuthority: e.target.value })}
            />
            <Box display="flex" gap={2}>
              <TextField
                fullWidth
                label="Issue Date"
                type="date"
                value={licenseForm.issueDate}
                onChange={(e) => setLicenseForm({ ...licenseForm, issueDate: e.target.value })}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                fullWidth
                label="Expiry Date"
                type="date"
                value={licenseForm.expiryDate}
                onChange={(e) => setLicenseForm({ ...licenseForm, expiryDate: e.target.value })}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Box>
            <Box display="flex" gap={2}>
              <TextField
                fullWidth
                label="Validity Period"
                value={licenseForm.validityPeriod}
                onChange={(e) => setLicenseForm({ ...licenseForm, validityPeriod: e.target.value })}
              />
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={licenseForm.status}
                  onChange={(e) => setLicenseForm({ ...licenseForm, status: e.target.value as License['status'] })}
                >
                  <MenuItem value="Valid">Valid</MenuItem>
                  <MenuItem value="Expiring Soon">Expiring Soon</MenuItem>
                  <MenuItem value="Expired">Expired</MenuItem>
                  <MenuItem value="Under Renewal">Under Renewal</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <TextField
              fullWidth
              label="Responsible Person"
              value={licenseForm.responsiblePerson}
              onChange={(e) => setLicenseForm({ ...licenseForm, responsiblePerson: e.target.value })}
            />
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Description"
              value={licenseForm.description}
              onChange={(e) => setLicenseForm({ ...licenseForm, description: e.target.value })}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Renewal Process"
              value={licenseForm.renewalProcess}
              onChange={(e) => setLicenseForm({ ...licenseForm, renewalProcess: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEdit}>Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Delete License</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{selectedLicense?.name}</strong>?
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
            Delete
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
import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  Paper,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  Tooltip,
  Divider,
  Alert
} from '@mui/material';
import {
  Search,
  Download,
  Add,
  MedicalServices,
  CheckCircle,
  Cancel,
  Warning,
  Assessment,
  Build,
  Star,
  Schedule,
  LocationOn
} from '@mui/icons-material';
import {
  equipmentMaster,
  getCriticalEquipment,
  getEquipmentStats,
  getEquipmentCategorySummary,
  exportEquipmentListForAudit,
  type EquipmentCategory,
  type EquipmentStatus,
  type EquipmentCompliance
} from '../data/equipmentMaster';

/**
 * Equipment Master Page Component
 * Displays and manages all hospital equipment from Google Sheets data
 */
const EquipmentMasterPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<EquipmentCategory | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<EquipmentStatus | 'All'>('All');
  const [complianceFilter, setComplianceFilter] = useState<EquipmentCompliance | 'All'>('All');
  const [showCriticalOnly, setShowCriticalOnly] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');

  // Calculate statistics
  const equipmentStats = getEquipmentStats();
  const categorySummary = getEquipmentCategorySummary();

  // Get unique departments
  const departments = useMemo(() => {
    const depts = [...new Set(equipmentMaster.map(eq => eq.department))];
    return depts.sort();
  }, []);

  // Filter equipment based on search and filters
  const filteredEquipment = useMemo(() => {
    let filtered = equipmentMaster;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(equipment => 
        equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        equipment.equipmentTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
        equipment.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        equipment.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'All') {
      filtered = filtered.filter(equipment => equipment.category === categoryFilter);
    }

    // Status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(equipment => equipment.status === statusFilter);
    }

    // Compliance filter
    if (complianceFilter !== 'All') {
      filtered = filtered.filter(equipment => equipment.compliance === complianceFilter);
    }

    // Department filter
    if (departmentFilter !== 'All') {
      filtered = filtered.filter(equipment => equipment.department === departmentFilter);
    }

    // Critical equipment filter
    if (showCriticalOnly) {
      filtered = filtered.filter(equipment => equipment.criticalEquipment);
    }

    return filtered;
  }, [searchTerm, categoryFilter, statusFilter, complianceFilter, departmentFilter, showCriticalOnly]);

  // Handle export to CSV
  const handleExport = () => {
    const exportData = exportEquipmentListForAudit();
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Equipment Tag,Name,Manufacturer,Category,Department,Location,Status,Compliance,Critical Equipment,Biomedical Clearance,Year of Purchase\n" +
      exportData.map(equipment => 
        `"${equipment.equipmentTag}","${equipment.name}","${equipment.manufacturer}","${equipment.category}","${equipment.department}","${equipment.location}","${equipment.status}","${equipment.compliance}","${equipment.criticalEquipment}","${equipment.biomedicalClearance}","${equipment.yearOfPurchase}"`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `equipment_master_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get status display properties
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'Operational':
        return { icon: CheckCircle, color: 'success' as const, label: 'Operational' };
      case 'Under Maintenance':
        return { icon: Build, color: 'warning' as const, label: 'Under Maintenance' };
      case 'Out of Service':
        return { icon: Cancel, color: 'error' as const, label: 'Out of Service' };
      case 'Pending Calibration':
        return { icon: Schedule, color: 'info' as const, label: 'Pending Calibration' };
      default:
        return { icon: Warning, color: 'secondary' as const, label: 'Unknown' };
    }
  };

  // Get compliance display properties
  const getComplianceDisplay = (compliance: string) => {
    switch (compliance) {
      case 'Compliant':
        return { icon: CheckCircle, color: 'success' as const, label: 'Compliant' };
      case 'Non-Compliant':
        return { icon: Cancel, color: 'error' as const, label: 'Non-Compliant' };
      case 'Calibration Due':
        return { icon: Warning, color: 'warning' as const, label: 'Calibration Due' };
      case 'Maintenance Due':
        return { icon: Build, color: 'warning' as const, label: 'Maintenance Due' };
      default:
        return { icon: Warning, color: 'secondary' as const, label: 'Pending Inspection' };
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setCategoryFilter('All');
    setStatusFilter('All');
    setComplianceFilter('All');
    setDepartmentFilter('All');
    setShowCriticalOnly(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h3" component="h1" gutterBottom>
              Equipment Master
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Hope Hospital ICU Equipment Inventory - NABH Audit Ready
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={handleExport}
              size="large"
            >
              Export for Audit
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              size="large"
            >
              Add Equipment
            </Button>
          </Box>
        </Box>

        {/* Equipment Overview Alert */}
        <Alert severity="info" sx={{ mb: 3 }}>
          <strong>ICU Equipment Inventory:</strong> {equipmentMaster.length} pieces of medical equipment tracked for NABH compliance. 
          Critical equipment: {getCriticalEquipment().length} units.
        </Alert>

        {/* Statistics Dashboard */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" variant="overline">
                      Total Equipment
                    </Typography>
                    <Typography variant="h4">
                      {equipmentStats.total}
                    </Typography>
                  </Box>
                  <MedicalServices color="primary" sx={{ fontSize: 32 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" variant="overline">
                      Operational
                    </Typography>
                    <Typography variant="h4" color="success.main">
                      {equipmentStats.operationalPercentage}%
                    </Typography>
                  </Box>
                  <CheckCircle color="success" sx={{ fontSize: 32 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" variant="overline">
                      Critical Equipment
                    </Typography>
                    <Typography variant="h4" color="error.main">
                      {equipmentStats.critical}
                    </Typography>
                  </Box>
                  <Star color="error" sx={{ fontSize: 32 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" variant="overline">
                      NABH Compliance
                    </Typography>
                    <Typography variant="h4" color="success.main">
                      {equipmentStats.compliancePercentage}%
                    </Typography>
                  </Box>
                  <Assessment color="success" sx={{ fontSize: 32 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Category Summary */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Assessment />
              Equipment Categories
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(categorySummary).map(([category, count]) => (
                <Grid size={{ xs: 6, md: 2 }} key={category}>
                  <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.50' }}>
                    <Typography variant="h5" color="primary.main">
                      {count}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {category}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {/* Filters and Search */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3}>
            {/* Search */}
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                placeholder="Search equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Category Filter */}
            <Grid size={{ xs: 12, md: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  label="Category"
                  onChange={(e) => setCategoryFilter(e.target.value as EquipmentCategory | 'All')}
                >
                  <MenuItem value="All">All Categories</MenuItem>
                  <MenuItem value="Critical Care">Critical Care</MenuItem>
                  <MenuItem value="Monitoring">Monitoring</MenuItem>
                  <MenuItem value="Diagnostic">Diagnostic</MenuItem>
                  <MenuItem value="Therapeutic">Therapeutic</MenuItem>
                  <MenuItem value="Emergency">Emergency</MenuItem>
                  <MenuItem value="Support">Support</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Status Filter */}
            <Grid size={{ xs: 12, md: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value as EquipmentStatus | 'All')}
                >
                  <MenuItem value="All">All Status</MenuItem>
                  <MenuItem value="Operational">Operational</MenuItem>
                  <MenuItem value="Under Maintenance">Under Maintenance</MenuItem>
                  <MenuItem value="Out of Service">Out of Service</MenuItem>
                  <MenuItem value="Pending Calibration">Pending Calibration</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Compliance Filter */}
            <Grid size={{ xs: 12, md: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Compliance</InputLabel>
                <Select
                  value={complianceFilter}
                  label="Compliance"
                  onChange={(e) => setComplianceFilter(e.target.value as EquipmentCompliance | 'All')}
                >
                  <MenuItem value="All">All Compliance</MenuItem>
                  <MenuItem value="Compliant">Compliant</MenuItem>
                  <MenuItem value="Non-Compliant">Non-Compliant</MenuItem>
                  <MenuItem value="Calibration Due">Calibration Due</MenuItem>
                  <MenuItem value="Maintenance Due">Maintenance Due</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Department Filter */}
            <Grid size={{ xs: 12, md: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={departmentFilter}
                  label="Department"
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                  <MenuItem value="All">All Departments</MenuItem>
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Critical Equipment Filter */}
            <Grid size={{ xs: 12, md: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showCriticalOnly}
                    onChange={(e) => setShowCriticalOnly(e.target.checked)}
                  />
                }
                label="Critical Only"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredEquipment.length} of {equipmentMaster.length} equipment
            </Typography>
            {(searchTerm || categoryFilter !== 'All' || statusFilter !== 'All' || complianceFilter !== 'All' || departmentFilter !== 'All' || showCriticalOnly) && (
              <Button
                size="small"
                onClick={clearAllFilters}
                color="primary"
              >
                Clear Filters
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Equipment Grid */}
      <Grid container spacing={3}>
        {filteredEquipment.map((equipment) => {
          const statusDisplay = getStatusDisplay(equipment.status);
          const complianceDisplay = getComplianceDisplay(equipment.compliance);
          const StatusIcon = statusDisplay.icon;
          const ComplianceIcon = complianceDisplay.icon;

          return (
            <Grid size={{ xs: 12, lg: 6 }} key={equipment.id}>
              <Card sx={{ height: '100%', '&:hover': { boxShadow: 4 } }}>
                <CardContent>
                  {/* Equipment Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="h6">
                          {equipment.name}
                        </Typography>
                        <Chip label={equipment.equipmentTag} size="small" color="primary" variant="outlined" />
                        {equipment.criticalEquipment && (
                          <Chip label="Critical" size="small" color="error" icon={<Star />} />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {equipment.manufacturer} • {equipment.category}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title={statusDisplay.label}>
                        <StatusIcon color={statusDisplay.color} />
                      </Tooltip>
                      <Tooltip title={complianceDisplay.label}>
                        <ComplianceIcon color={complianceDisplay.color} />
                      </Tooltip>
                    </Box>
                  </Box>

                  {/* Equipment Details */}
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        DEPARTMENT
                      </Typography>
                      <Typography variant="body2">
                        {equipment.department}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        LOCATION
                      </Typography>
                      <Typography variant="body2">
                        {equipment.location}
                      </Typography>
                    </Grid>
                  </Grid>

                  {/* Location & Year */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <LocationOn fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {equipment.location}
                    </Typography>
                    {equipment.yearOfPurchase && (
                      <>
                        <Typography variant="body2" color="text.secondary"> • </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {equipment.yearOfPurchase}
                        </Typography>
                      </>
                    )}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Status and Compliance */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip
                        icon={<StatusIcon />}
                        label={statusDisplay.label}
                        size="small"
                        color={statusDisplay.color}
                        variant="outlined"
                      />
                      <Chip
                        icon={<ComplianceIcon />}
                        label={complianceDisplay.label}
                        size="small"
                        color={complianceDisplay.color}
                        variant="outlined"
                      />
                    </Box>
                  </Box>

                  {/* Additional Info */}
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {equipment.biomedicalClearance && (
                      <Chip label="BME Cleared" size="small" color="success" variant="filled" />
                    )}
                    {equipment.backupAvailable && (
                      <Chip label="Backup Available" size="small" color="info" variant="outlined" />
                    )}
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button size="small" color="primary">
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Empty State */}
      {filteredEquipment.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <MedicalServices sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No equipment found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search criteria or filters.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default EquipmentMasterPage;
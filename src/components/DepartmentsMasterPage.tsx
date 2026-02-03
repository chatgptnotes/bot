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
  IconButton,
  Paper,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Search,
  Download,
  Add,
  Business,
  Schedule,
  CheckCircle,
  Cancel,
  Warning,
  Assessment
} from '@mui/icons-material';
import {
  departmentsMaster,
  getEmergencyDepartments,
  getNABHComplianceStats,
  getDepartmentCategorySummary,
  exportDepartmentListForAudit,
  type DepartmentCategory,
  type DepartmentType
} from '../data/departmentsMaster';

/**
 * Departments Master Page Component
 * Displays and manages all hospital departments from scope of services
 */
const DepartmentsMasterPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<DepartmentCategory | 'All'>('All');
  const [typeFilter, setTypeFilter] = useState<DepartmentType | 'All'>('All');
  const [complianceFilter, setComplianceFilter] = useState<'All' | 'Compliant' | 'Non-Compliant' | 'Under Review' | 'Not Assessed'>('All');
  const [showEmergencyOnly, setShowEmergencyOnly] = useState(false);

  // Calculate statistics
  const complianceStats = getNABHComplianceStats();
  const categorySummary = getDepartmentCategorySummary();

  // Filter departments based on search and filters
  const filteredDepartments = useMemo(() => {
    let filtered = departmentsMaster;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(dept => 
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'All') {
      filtered = filtered.filter(dept => dept.category === categoryFilter);
    }

    // Type filter
    if (typeFilter !== 'All') {
      filtered = filtered.filter(dept => dept.type === typeFilter);
    }

    // Compliance filter
    if (complianceFilter !== 'All') {
      filtered = filtered.filter(dept => dept.nabhCompliance.complianceStatus === complianceFilter);
    }

    // Emergency services filter
    if (showEmergencyOnly) {
      filtered = filtered.filter(dept => dept.isEmergencyService);
    }

    return filtered;
  }, [searchTerm, categoryFilter, typeFilter, complianceFilter, showEmergencyOnly]);

  // Handle export to CSV
  const handleExport = () => {
    const exportData = exportDepartmentListForAudit();
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Code,Name,Category,Type,Emergency Service,Operating Hours,Compliance Status,Services\n" +
      exportData.map(dept => 
        `"${dept.code}","${dept.name}","${dept.category}","${dept.type}","${dept.isEmergencyService}","${dept.operatingHours}","${dept.complianceStatus}","${dept.services}"`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `departments_master_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get compliance status color and icon
  const getComplianceDisplay = (status: string) => {
    switch (status) {
      case 'Compliant':
        return { icon: CheckCircle, color: 'success' as const, label: 'Compliant' };
      case 'Non-Compliant':
        return { icon: Cancel, color: 'error' as const, label: 'Non-Compliant' };
      case 'Under Review':
        return { icon: Warning, color: 'warning' as const, label: 'Under Review' };
      default:
        return { icon: Warning, color: 'secondary' as const, label: 'Not Assessed' };
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setCategoryFilter('All');
    setTypeFilter('All');
    setComplianceFilter('All');
    setShowEmergencyOnly(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h3" component="h1" gutterBottom>
              Departments Master
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Based on Scope of Services - Ayushman Nagpur Hospital (Sep 26, 2025)
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
              Add Department
            </Button>
          </Box>
        </Box>

        {/* Statistics Dashboard */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" variant="overline">
                      Total Departments
                    </Typography>
                    <Typography variant="h4">
                      {complianceStats.total}
                    </Typography>
                  </Box>
                  <Business color="primary" sx={{ fontSize: 32 }} />
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
                      {complianceStats.compliancePercentage}%
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
                      Emergency Services
                    </Typography>
                    <Typography variant="h4" color="error.main">
                      {getEmergencyDepartments().length}
                    </Typography>
                  </Box>
                  <Schedule color="error" sx={{ fontSize: 32 }} />
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
                      Under Review
                    </Typography>
                    <Typography variant="h4" color="warning.main">
                      {complianceStats.underReview}
                    </Typography>
                  </Box>
                  <Warning color="warning" sx={{ fontSize: 32 }} />
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
              Department Categories
            </Typography>
            <Grid container spacing={3}>
              {Object.entries(categorySummary).map(([category, count]) => (
                <Grid size={{ xs: 6, md: 3 }} key={category}>
                  <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.50' }}>
                    <Typography variant="h4" color="primary.main">
                      {count}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
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
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                placeholder="Search departments..."
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
                  onChange={(e) => setCategoryFilter(e.target.value as DepartmentCategory | 'All')}
                >
                  <MenuItem value="All">All Categories</MenuItem>
                  <MenuItem value="Clinical Speciality">Clinical Speciality</MenuItem>
                  <MenuItem value="Super Speciality">Super Speciality</MenuItem>
                  <MenuItem value="Support Services">Support Services</MenuItem>
                  <MenuItem value="Administration">Administration</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Type Filter */}
            <Grid size={{ xs: 12, md: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={typeFilter}
                  label="Type"
                  onChange={(e) => setTypeFilter(e.target.value as DepartmentType | 'All')}
                >
                  <MenuItem value="All">All Types</MenuItem>
                  <MenuItem value="Medical">Medical</MenuItem>
                  <MenuItem value="Surgical">Surgical</MenuItem>
                  <MenuItem value="Diagnostic">Diagnostic</MenuItem>
                  <MenuItem value="Support">Support</MenuItem>
                  <MenuItem value="Administrative">Administrative</MenuItem>
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
                  onChange={(e) => setComplianceFilter(e.target.value as typeof complianceFilter)}
                >
                  <MenuItem value="All">All Status</MenuItem>
                  <MenuItem value="Compliant">Compliant</MenuItem>
                  <MenuItem value="Non-Compliant">Non-Compliant</MenuItem>
                  <MenuItem value="Under Review">Under Review</MenuItem>
                  <MenuItem value="Not Assessed">Not Assessed</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Emergency Filter */}
            <Grid size={{ xs: 12, md: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showEmergencyOnly}
                    onChange={(e) => setShowEmergencyOnly(e.target.checked)}
                  />
                }
                label="Emergency Only"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredDepartments.length} of {departmentsMaster.length} departments
            </Typography>
            {(searchTerm || categoryFilter !== 'All' || typeFilter !== 'All' || complianceFilter !== 'All' || showEmergencyOnly) && (
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

      {/* Departments Grid */}
      <Grid container spacing={3}>
        {filteredDepartments.map((department) => {
          const complianceDisplay = getComplianceDisplay(department.nabhCompliance.complianceStatus);
          const ComplianceIcon = complianceDisplay.icon;

          return (
            <Grid size={{ xs: 12, lg: 6 }} key={department.id}>
              <Card sx={{ height: '100%', '&:hover': { boxShadow: 4 } }}>
                <CardContent>
                  {/* Department Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="h6">
                          {department.name}
                        </Typography>
                        <Chip label={department.code} size="small" color="primary" variant="outlined" />
                        {department.isEmergencyService && (
                          <Chip label="24/7" size="small" color="error" />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {department.description}
                      </Typography>
                    </Box>
                    <Tooltip title={complianceDisplay.label}>
                      <IconButton color={complianceDisplay.color} size="small">
                        <ComplianceIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  {/* Department Details */}
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        CATEGORY
                      </Typography>
                      <Typography variant="body2">
                        {department.category}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        TYPE
                      </Typography>
                      <Typography variant="body2">
                        {department.type}
                      </Typography>
                    </Grid>
                  </Grid>

                  {/* Operating Hours */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Schedule fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {department.operatingHours}
                    </Typography>
                  </Box>

                  {/* Services */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                      SERVICES
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {department.services.slice(0, 3).map((service, index) => (
                        <Chip
                          key={index}
                          label={service}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                      {department.services.length > 3 && (
                        <Chip
                          label={`+${department.services.length - 3} more`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Compliance Status */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Chip
                      icon={<ComplianceIcon />}
                      label={complianceDisplay.label}
                      size="small"
                      color={complianceDisplay.color}
                      variant="outlined"
                    />
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
      {filteredDepartments.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Business sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No departments found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search criteria or filters.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default DepartmentsMasterPage;
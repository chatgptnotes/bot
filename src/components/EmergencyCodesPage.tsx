import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Button,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Divider,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  LocalHospital as MedicalIcon,
  LocalFireDepartment as FireIcon,
  ChildCare as InfantIcon,
  Download as DownloadIcon,
  Assignment as FormIcon,
  School as TrainingIcon,
  Assessment as DrillIcon,
  Warning as EmergencyIcon,
  CheckCircle as CheckIcon,
  Description as DocIcon,
  Print as PrintIcon
} from '@mui/icons-material';

import {
  EMERGENCY_CODES_MASTER,
  EmergencyCodeProtocol,
  EmergencyCodeDocument,
  EmergencyCodeType,
  DocumentType,
  generateEmergencyCodeReport,
  getDocumentsByCodeType,
  EMERGENCY_CODES_SUMMARY
} from '../data/emergencyCodesMaster';

const EmergencyCodesPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedCode, setSelectedCode] = useState<EmergencyCodeType>('CODE_BLUE');
  const [selectedDocument, setSelectedDocument] = useState<EmergencyCodeDocument | null>(null);
  const [showDocumentDialog, setShowDocumentDialog] = useState(false);
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const getCodeIcon = (codeType: EmergencyCodeType) => {
    switch (codeType) {
      case 'CODE_BLUE':
        return <MedicalIcon sx={{ color: '#2196f3' }} />;
      case 'CODE_RED':
        return <FireIcon sx={{ color: '#f44336' }} />;
      case 'CODE_PINK':
        return <InfantIcon sx={{ color: '#e91e63' }} />;
      default:
        return <EmergencyIcon />;
    }
  };

  const getCodeColor = (codeType: EmergencyCodeType) => {
    switch (codeType) {
      case 'CODE_BLUE':
        return '#2196f3';
      case 'CODE_RED':
        return '#f44336';
      case 'CODE_PINK':
        return '#e91e63';
      default:
        return '#666666';
    }
  };

  const handleDocumentView = (document: EmergencyCodeDocument) => {
    setSelectedDocument(document);
    setShowDocumentDialog(true);
  };

  const handleFormGenerate = (document: EmergencyCodeDocument) => {
    setSelectedDocument(document);
    setFormData({});
    setShowFormDialog(true);
  };

  const handleFormSave = () => {
    // In a real implementation, this would save to database
    console.log('Saving form data:', formData);
    setShowFormDialog(false);
    alert('Form saved successfully!');
  };

  const handleFormDownload = (document: EmergencyCodeDocument) => {
    const content = document.template;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${document.title.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleProtocolDownload = (codeType: EmergencyCodeType) => {
    const report = generateEmergencyCodeReport(codeType);
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${codeType}_Protocol_Report.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderProtocolOverview = () => (
    <Grid container spacing={3}>
      {EMERGENCY_CODES_MASTER.map((protocol) => (
        <Grid item xs={12} md={4} key={protocol.codeType}>
          <Card 
            sx={{ 
              border: `2px solid ${getCodeColor(protocol.codeType)}`,
              cursor: 'pointer',
              '&:hover': { boxShadow: 6 }
            }}
            onClick={() => setSelectedCode(protocol.codeType)}
          >
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                {getCodeIcon(protocol.codeType)}
                <Typography variant="h6" color={getCodeColor(protocol.codeType)}>
                  {protocol.codeType.replace('_', ' ')}
                </Typography>
              </Box>
              
              <Typography variant="h5" gutterBottom>
                {protocol.name}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" mb={2}>
                {protocol.description}
              </Typography>

              <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                <Chip 
                  label={`Response: ${protocol.responseTime}`} 
                  size="small" 
                  color="primary"
                />
                <Chip 
                  label={`${protocol.documents.length} Documents`} 
                  size="small" 
                  color="secondary"
                />
              </Box>

              <Box display="flex" gap={1}>
                <Button
                  size="small"
                  startIcon={<DownloadIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProtocolDownload(protocol.codeType);
                  }}
                >
                  Download Protocol
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderProtocolDetails = () => {
    const protocol = EMERGENCY_CODES_MASTER.find(p => p.codeType === selectedCode);
    if (!protocol) return null;

    return (
      <Box>
        <Paper sx={{ p: 3, mb: 3, border: `2px solid ${getCodeColor(selectedCode)}` }}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            {getCodeIcon(selectedCode)}
            <Typography variant="h4" color={getCodeColor(selectedCode)}>
              {protocol.name}
            </Typography>
          </Box>
          
          <Alert severity="info" sx={{ mb: 3 }}>
            Response Time Target: <strong>{protocol.responseTime}</strong>
          </Alert>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom color={getCodeColor(selectedCode)}>
                Activation Criteria
              </Typography>
              <List dense>
                {protocol.activationCriteria.map((criteria, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <EmergencyIcon color="warning" />
                    </ListItemIcon>
                    <ListItemText primary={criteria} />
                  </ListItem>
                ))}
              </List>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom color={getCodeColor(selectedCode)}>
                Response Team
              </Typography>
              <List dense>
                {protocol.responseTeam.map((member, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckIcon color="success" />
                    </ListItemIcon>
                    <ListItemText primary={member} />
                  </ListItem>
                ))}
              </List>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom color={getCodeColor(selectedCode)}>
                Required Equipment
              </Typography>
              <List dense>
                {protocol.equipmentRequired.map((equipment, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckIcon color="success" />
                    </ListItemIcon>
                    <ListItemText primary={equipment} />
                  </ListItem>
                ))}
              </List>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom color={getCodeColor(selectedCode)}>
                Training Requirements
              </Typography>
              <List dense>
                {protocol.trainingRequirements.map((req, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <TrainingIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={req} />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </Paper>

        <Typography variant="h5" gutterBottom>
          Documentation Package
        </Typography>

        <Grid container spacing={2}>
          {protocol.documents.map((document) => (
            <Grid item xs={12} md={6} key={document.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <DocIcon />
                    <Typography variant="h6" noWrap>
                      {document.title}
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {document.description}
                  </Typography>

                  <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                    <Chip 
                      label={document.documentType.replace('_', ' ')} 
                      size="small" 
                      color="primary"
                    />
                    <Chip 
                      label={document.frequency} 
                      size="small" 
                      color="secondary"
                    />
                  </Box>

                  <Typography variant="caption" display="block" mb={2}>
                    <strong>Responsible:</strong> {document.responsiblePerson}
                  </Typography>

                  <Typography variant="caption" display="block" mb={2}>
                    <strong>NABH Standards:</strong> {document.nabhStandard.join(', ')}
                  </Typography>

                  <Box display="flex" gap={1} flexWrap="wrap">
                    <Button
                      size="small"
                      startIcon={<FormIcon />}
                      onClick={() => handleDocumentView(document)}
                    >
                      View Template
                    </Button>
                    <Button
                      size="small"
                      startIcon={<DownloadIcon />}
                      onClick={() => handleFormDownload(document)}
                    >
                      Download
                    </Button>
                    {document.documentType !== 'SOP' && (
                      <Button
                        size="small"
                        startIcon={<PrintIcon />}
                        variant="outlined"
                        onClick={() => handleFormGenerate(document)}
                      >
                        Generate Form
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  const renderSummaryDashboard = () => (
    <Box>
      <Typography variant="h4" gutterBottom>
        Emergency Codes Summary
      </Typography>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h3" color="primary">
                {EMERGENCY_CODES_SUMMARY.totalProtocols}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Emergency Protocols
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h3" color="secondary">
                {EMERGENCY_CODES_SUMMARY.totalDocuments}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Documents
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h3" color="success.main">
                100%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                NABH Compliance
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h3" color="warning.main">
                READY
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Audit Status
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Alert severity="success" sx={{ mb: 3 }}>
        <strong>NABH Audit Ready!</strong> All emergency protocols are documented and compliant with NABH 3rd Edition standards.
      </Alert>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button
              startIcon={<DownloadIcon />}
              variant="contained"
              onClick={() => {
                EMERGENCY_CODES_MASTER.forEach(protocol => {
                  handleProtocolDownload(protocol.codeType);
                });
              }}
            >
              Download All Protocols
            </Button>
            <Button
              startIcon={<PrintIcon />}
              variant="outlined"
            >
              Print Documentation Package
            </Button>
            <Button
              startIcon={<TrainingIcon />}
              variant="outlined"
            >
              Schedule Training Drills
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3" gutterBottom>
        Emergency Codes Master
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" mb={3}>
        Code Blue, Code Red & Code Pink - Complete Documentation System
      </Typography>

      <Tabs value={selectedTab} onChange={(_, newValue) => setSelectedTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="Overview" />
        <Tab label="Protocol Details" />
        <Tab label="Summary Dashboard" />
      </Tabs>

      {selectedTab === 0 && renderProtocolOverview()}
      {selectedTab === 1 && renderProtocolDetails()}
      {selectedTab === 2 && renderSummaryDashboard()}

      {/* Document Template Dialog */}
      <Dialog 
        open={showDocumentDialog} 
        onClose={() => setShowDocumentDialog(false)}
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          {selectedDocument?.title}
        </DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <Typography variant="body2" color="text.secondary">
              {selectedDocument?.description}
            </Typography>
          </Box>
          <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>
              {selectedDocument?.template}
            </pre>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDocumentDialog(false)}>
            Close
          </Button>
          {selectedDocument && (
            <Button 
              startIcon={<DownloadIcon />}
              onClick={() => handleFormDownload(selectedDocument)}
              variant="contained"
            >
              Download Template
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Form Generation Dialog */}
      <Dialog 
        open={showFormDialog} 
        onClose={() => setShowFormDialog(false)}
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          Generate Form: {selectedDocument?.title}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {selectedDocument?.mandatoryFields.map((field, index) => (
              <Grid item xs={12} md={6} key={index}>
                <TextField
                  fullWidth
                  label={field}
                  value={formData[field] || ''}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  margin="normal"
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowFormDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleFormSave}
            variant="contained"
            color="primary"
          >
            Generate & Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmergencyCodesPage;
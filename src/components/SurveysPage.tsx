import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Rating,
  LinearProgress,
  Paper,
  Divider,
} from '@mui/material';
import {
  Poll as PollIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  ExpandMore as ExpandMoreIcon,
  Star as StarIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { supabase } from '../lib/supabase';

// Survey Interfaces
interface SurveyQuestion {
  id: string;
  question: string;
  type: 'rating' | 'multiple_choice' | 'text' | 'yes_no' | 'scale';
  options?: string[];
  required: boolean;
  category?: string;
}

interface Survey {
  id: string;
  title: string;
  description: string;
  type: 'patient_satisfaction' | 'staff_satisfaction' | 'feedback' | 'quality_assessment' | 'custom';
  status: 'draft' | 'active' | 'completed';
  questions: SurveyQuestion[];
  targetAudience: string;
  startDate: string;
  endDate: string;
  responseCount: number;
  createdBy: string;
  createdAt: string;
  nabhRelevant: boolean;
  frequency: 'one_time' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
}

interface SurveyResponse {
  id: string;
  surveyId: string;
  respondentId: string;
  respondentType: 'patient' | 'staff' | 'visitor' | 'consultant';
  responses: Record<string, any>;
  submittedAt: string;
  completionTime: number; // in minutes
}

// Survey Templates
const SURVEY_TEMPLATES = [
  {
    title: 'Staff Satisfaction Survey',
    description: 'Comprehensive staff satisfaction assessment for NABH compliance',
    type: 'staff_satisfaction' as const,
    nabhRelevant: true,
    frequency: 'quarterly' as const,
    targetAudience: 'All hospital staff (doctors, nurses, admin, support)',
    questions: [
      {
        id: 'overall_satisfaction',
        question: 'How satisfied are you with your overall work experience at Hope Hospital?',
        type: 'rating' as const,
        required: true,
        category: 'General Satisfaction',
      },
      {
        id: 'work_environment',
        question: 'How would you rate the work environment and workplace culture?',
        type: 'rating' as const,
        required: true,
        category: 'Work Environment',
      },
      {
        id: 'management_support',
        question: 'How satisfied are you with the support provided by your immediate supervisor/manager?',
        type: 'rating' as const,
        required: true,
        category: 'Management',
      },
      {
        id: 'career_development',
        question: 'How satisfied are you with career development and training opportunities?',
        type: 'rating' as const,
        required: true,
        category: 'Professional Development',
      },
      {
        id: 'work_life_balance',
        question: 'How would you rate your work-life balance?',
        type: 'rating' as const,
        required: true,
        category: 'Work-Life Balance',
      },
      {
        id: 'communication',
        question: 'How effective is communication within your department and across departments?',
        type: 'rating' as const,
        required: true,
        category: 'Communication',
      },
      {
        id: 'resources_equipment',
        question: 'Do you have adequate resources and equipment to perform your job effectively?',
        type: 'yes_no' as const,
        required: true,
        category: 'Resources',
      },
      {
        id: 'safety_protocols',
        question: 'How satisfied are you with workplace safety protocols and infection control measures?',
        type: 'rating' as const,
        required: true,
        category: 'Safety & Quality',
      },
      {
        id: 'compensation_benefits',
        question: 'How satisfied are you with your compensation and benefits package?',
        type: 'rating' as const,
        required: false,
        category: 'Compensation',
      },
      {
        id: 'recognition',
        question: 'Do you feel your contributions are recognized and appreciated?',
        type: 'yes_no' as const,
        required: true,
        category: 'Recognition',
      },
      {
        id: 'recommend_workplace',
        question: 'Would you recommend Hope Hospital as a good place to work to others?',
        type: 'yes_no' as const,
        required: true,
        category: 'Overall Recommendation',
      },
      {
        id: 'biggest_challenge',
        question: 'What is the biggest challenge you face in your current role?',
        type: 'text' as const,
        required: false,
        category: 'Feedback',
      },
      {
        id: 'improvement_suggestions',
        question: 'What suggestions do you have for improving the workplace?',
        type: 'text' as const,
        required: false,
        category: 'Feedback',
      },
      {
        id: 'nabh_awareness',
        question: 'Are you aware of NABH quality standards and their importance to our hospital?',
        type: 'yes_no' as const,
        required: true,
        category: 'Quality Awareness',
      },
      {
        id: 'quality_commitment',
        question: 'How committed are you to maintaining and improving quality standards in your work?',
        type: 'rating' as const,
        required: true,
        category: 'Quality Commitment',
      },
    ],
  },
  {
    title: 'Patient Satisfaction Survey',
    description: 'Patient experience and satisfaction assessment',
    type: 'patient_satisfaction' as const,
    nabhRelevant: true,
    frequency: 'monthly' as const,
    targetAudience: 'All patients and their families',
    questions: [
      {
        id: 'overall_experience',
        question: 'How would you rate your overall experience at Hope Hospital?',
        type: 'rating' as const,
        required: true,
        category: 'Overall Experience',
      },
      {
        id: 'admission_process',
        question: 'How satisfied were you with the admission process?',
        type: 'rating' as const,
        required: true,
        category: 'Admission',
      },
      {
        id: 'doctor_care',
        question: 'How satisfied were you with the care provided by doctors?',
        type: 'rating' as const,
        required: true,
        category: 'Medical Care',
      },
      {
        id: 'nursing_care',
        question: 'How satisfied were you with the nursing care?',
        type: 'rating' as const,
        required: true,
        category: 'Nursing Care',
      },
      {
        id: 'cleanliness',
        question: 'How would you rate the cleanliness of the hospital?',
        type: 'rating' as const,
        required: true,
        category: 'Facilities',
      },
      {
        id: 'food_quality',
        question: 'If applicable, how satisfied were you with the food quality?',
        type: 'rating' as const,
        required: false,
        category: 'Food Service',
      },
      {
        id: 'communication',
        question: 'How well did staff communicate with you about your treatment?',
        type: 'rating' as const,
        required: true,
        category: 'Communication',
      },
      {
        id: 'discharge_process',
        question: 'How satisfied were you with the discharge process?',
        type: 'rating' as const,
        required: true,
        category: 'Discharge',
      },
      {
        id: 'recommend_hospital',
        question: 'Would you recommend Hope Hospital to others?',
        type: 'yes_no' as const,
        required: true,
        category: 'Recommendation',
      },
      {
        id: 'suggestions',
        question: 'Any suggestions for improvement?',
        type: 'text' as const,
        required: false,
        category: 'Feedback',
      },
    ],
  },
  {
    title: 'Quality Assessment Survey',
    description: 'Internal quality assessment and improvement feedback',
    type: 'quality_assessment' as const,
    nabhRelevant: true,
    frequency: 'monthly' as const,
    targetAudience: 'Department heads and quality coordinators',
    questions: [
      {
        id: 'quality_standards',
        question: 'How well are NABH quality standards being implemented in your department?',
        type: 'rating' as const,
        required: true,
        category: 'Quality Implementation',
      },
      {
        id: 'documentation',
        question: 'How satisfied are you with current documentation processes?',
        type: 'rating' as const,
        required: true,
        category: 'Documentation',
      },
      {
        id: 'training_adequacy',
        question: 'Is your team adequately trained on quality protocols?',
        type: 'yes_no' as const,
        required: true,
        category: 'Training',
      },
      {
        id: 'improvement_areas',
        question: 'What areas need the most improvement for NABH compliance?',
        type: 'text' as const,
        required: true,
        category: 'Improvement Areas',
      },
    ],
  },
];

// Tab Panel Component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`survey-tabpanel-${index}`}
      aria-labelledby={`survey-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function SurveysPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // New survey form state
  const [newSurvey, setNewSurvey] = useState({
    title: '',
    description: '',
    type: 'custom' as Survey['type'],
    targetAudience: '',
    startDate: '',
    endDate: '',
    frequency: 'one_time' as Survey['frequency'],
    nabhRelevant: false,
  });

  // Load surveys on component mount
  useEffect(() => {
    loadSurveys();
  }, []);

  const loadSurveys = async () => {
    try {
      // For now, we'll use local state. In a real implementation, this would load from Supabase
      const defaultSurveys: Survey[] = SURVEY_TEMPLATES.map((template, index) => ({
        id: `survey_${Date.now()}_${index}`,
        ...template,
        status: 'draft' as const,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        responseCount: Math.floor(Math.random() * 50) + 10, // Mock response count
        createdBy: 'Dr. Shiraz (Quality Coordinator)',
        createdAt: new Date().toISOString(),
      }));
      
      setSurveys(defaultSurveys);
    } catch (error) {
      console.error('Error loading surveys:', error);
      setSnackbar({ open: true, message: 'Failed to load surveys', severity: 'error' });
    }
  };

  const handleCreateSurvey = () => {
    if (!selectedTemplate) {
      setSnackbar({ open: true, message: 'Please select a survey template', severity: 'error' });
      return;
    }

    const template = SURVEY_TEMPLATES.find(t => t.title === selectedTemplate);
    if (!template) return;

    const newSurveyObj: Survey = {
      id: `survey_${Date.now()}_${Math.random()}`,
      ...template,
      ...newSurvey,
      status: 'draft',
      questions: template.questions,
      responseCount: 0,
      createdBy: 'Dr. Shiraz (Quality Coordinator)',
      createdAt: new Date().toISOString(),
    };

    setSurveys([...surveys, newSurveyObj]);
    setIsAddDialogOpen(false);
    setNewSurvey({
      title: '',
      description: '',
      type: 'custom',
      targetAudience: '',
      startDate: '',
      endDate: '',
      frequency: 'one_time',
      nabhRelevant: false,
    });
    setSelectedTemplate('');
    setSnackbar({ open: true, message: 'Survey created successfully', severity: 'success' });
  };

  const handleActivateSurvey = (surveyId: string) => {
    setSurveys(surveys.map(s => 
      s.id === surveyId 
        ? { ...s, status: 'active' as const }
        : s
    ));
    setSnackbar({ open: true, message: 'Survey activated successfully', severity: 'success' });
  };

  const handleDeleteSurvey = (surveyId: string) => {
    setSurveys(surveys.filter(s => s.id !== surveyId));
    setIsDeleteDialogOpen(false);
    setSnackbar({ open: true, message: 'Survey deleted successfully', severity: 'success' });
  };

  const getSurveyStats = () => {
    const total = surveys.length;
    const active = surveys.filter(s => s.status === 'active').length;
    const draft = surveys.filter(s => s.status === 'draft').length;
    const completed = surveys.filter(s => s.status === 'completed').length;
    const totalResponses = surveys.reduce((acc, s) => acc + s.responseCount, 0);

    return { total, active, draft, completed, totalResponses };
  };

  const stats = getSurveyStats();

  const getStatusColor = (status: Survey['status']) => {
    switch (status) {
      case 'active': return 'success';
      case 'completed': return 'primary';
      case 'draft': return 'warning';
      default: return 'default';
    }
  };

  const getTypeColor = (type: Survey['type']) => {
    switch (type) {
      case 'staff_satisfaction': return 'info';
      case 'patient_satisfaction': return 'success';
      case 'quality_assessment': return 'error';
      case 'feedback': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <PollIcon sx={{ color: 'primary.main', fontSize: 32 }} />
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Survey Management
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Patient & Staff satisfaction surveys for NABH compliance
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsAddDialogOpen(true)}
        >
          Create Survey
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Surveys
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main" fontWeight="bold">
                {stats.active}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Surveys
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main" fontWeight="bold">
                {stats.draft}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Draft Surveys
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary.main" fontWeight="bold">
                {stats.completed}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main" fontWeight="bold">
                {stats.totalResponses}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Responses
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="All Surveys" />
          <Tab label="Active" />
          <Tab label="NABH Required" />
          <Tab label="Templates" />
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        {/* All Surveys */}
        <Grid container spacing={3}>
          {surveys.map(survey => (
            <Grid item xs={12} md={6} lg={4} key={survey.id}>
              <Card elevation={2}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                    <Typography variant="h6" fontWeight="bold" noWrap>
                      {survey.title}
                    </Typography>
                    <Chip
                      label={survey.status}
                      size="small"
                      color={getStatusColor(survey.status) as any}
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" mb={2} 
                    sx={{ 
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                    {survey.description}
                  </Typography>

                  <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                    <Chip
                      label={survey.type.replace('_', ' ')}
                      size="small"
                      color={getTypeColor(survey.type) as any}
                      variant="outlined"
                    />
                    {survey.nabhRelevant && (
                      <Chip
                        label="NABH"
                        size="small"
                        color="error"
                        variant="outlined"
                      />
                    )}
                    <Chip
                      label={survey.frequency.replace('_', ' ')}
                      size="small"
                      variant="outlined"
                    />
                  </Box>

                  <Box mb={2}>
                    <Typography variant="caption" color="text.secondary">
                      Target: {survey.targetAudience}
                    </Typography>
                    <br />
                    <Typography variant="caption" color="text.secondary">
                      Questions: {survey.questions.length} | Responses: {survey.responseCount}
                    </Typography>
                    <br />
                    <Typography variant="caption" color="text.secondary">
                      Period: {new Date(survey.startDate).toLocaleDateString()} - {new Date(survey.endDate).toLocaleDateString()}
                    </Typography>
                  </Box>

                  {/* Response Rate Progress */}
                  <Box mb={2}>
                    <Typography variant="caption" color="text.secondary">
                      Response Rate
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min((survey.responseCount / 100) * 100, 100)}
                      sx={{ mt: 0.5 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {survey.responseCount} responses
                    </Typography>
                  </Box>
                </CardContent>

                <CardActions sx={{ justifyContent: 'space-between' }}>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedSurvey(survey);
                        setIsViewDialogOpen(true);
                      }}
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small"
                      onClick={() => {
                        setSelectedSurvey(survey);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  <Box>
                    {survey.status === 'draft' && (
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<SendIcon />}
                        onClick={() => handleActivateSurvey(survey.id)}
                      >
                        Activate
                      </Button>
                    )}
                    {survey.status === 'active' && (
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                      >
                        Download
                      </Button>
                    )}
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {/* Active Surveys */}
        <Grid container spacing={3}>
          {surveys.filter(s => s.status === 'active').map(survey => (
            <Grid item xs={12} md={6} key={survey.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {survey.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {survey.description}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Responses:</strong> {survey.responseCount}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Active Until:</strong> {new Date(survey.endDate).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        {/* NABH Required Surveys */}
        <Grid container spacing={3}>
          {surveys.filter(s => s.nabhRelevant).map(survey => (
            <Grid item xs={12} md={6} key={survey.id}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <AssignmentIcon color="error" />
                    <Typography variant="h6" fontWeight="bold">
                      {survey.title}
                    </Typography>
                    <Chip label="NABH Required" color="error" size="small" />
                  </Box>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {survey.description}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Frequency:</strong> {survey.frequency.replace('_', ' ')}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Last Conducted:</strong> {new Date(survey.startDate).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        {/* Survey Templates */}
        <Grid container spacing={3}>
          {SURVEY_TEMPLATES.map((template, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" mb={1}>
                    {template.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {template.description}
                  </Typography>
                  <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                    <Chip
                      label={template.type.replace('_', ' ')}
                      size="small"
                      color={getTypeColor(template.type) as any}
                      variant="outlined"
                    />
                    {template.nabhRelevant && (
                      <Chip
                        label="NABH"
                        size="small"
                        color="error"
                        variant="outlined"
                      />
                    )}
                    <Chip
                      label={`${template.questions.length} questions`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                  <Typography variant="body2" mb={1}>
                    <strong>Target:</strong> {template.targetAudience}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Frequency:</strong> {template.frequency.replace('_', ' ')}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setSelectedTemplate(template.title);
                      setNewSurvey({ 
                        ...newSurvey, 
                        title: template.title,
                        description: template.description,
                        type: template.type,
                        targetAudience: template.targetAudience,
                        frequency: template.frequency,
                        nabhRelevant: template.nabhRelevant,
                      });
                      setIsAddDialogOpen(true);
                    }}
                  >
                    Use Template
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Create Survey Dialog */}
      <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Survey</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Template</InputLabel>
            <Select
              value={selectedTemplate}
              onChange={(e) => {
                const template = SURVEY_TEMPLATES.find(t => t.title === e.target.value);
                if (template) {
                  setSelectedTemplate(e.target.value);
                  setNewSurvey({
                    title: template.title,
                    description: template.description,
                    type: template.type,
                    targetAudience: template.targetAudience,
                    frequency: template.frequency,
                    nabhRelevant: template.nabhRelevant,
                    startDate: '',
                    endDate: '',
                  });
                }
              }}
            >
              {SURVEY_TEMPLATES.map(template => (
                <MenuItem key={template.title} value={template.title}>
                  {template.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Survey Title"
            value={newSurvey.title}
            onChange={(e) => setNewSurvey({ ...newSurvey, title: e.target.value })}
            margin="normal"
          />

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            value={newSurvey.description}
            onChange={(e) => setNewSurvey({ ...newSurvey, description: e.target.value })}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Target Audience"
            value={newSurvey.targetAudience}
            onChange={(e) => setNewSurvey({ ...newSurvey, targetAudience: e.target.value })}
            margin="normal"
          />

          <Box display="flex" gap={2}>
            <TextField
              fullWidth
              type="date"
              label="Start Date"
              value={newSurvey.startDate}
              onChange={(e) => setNewSurvey({ ...newSurvey, startDate: e.target.value })}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              type="date"
              label="End Date"
              value={newSurvey.endDate}
              onChange={(e) => setNewSurvey({ ...newSurvey, endDate: e.target.value })}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          <FormControl fullWidth margin="normal">
            <InputLabel>Frequency</InputLabel>
            <Select
              value={newSurvey.frequency}
              onChange={(e) => setNewSurvey({ ...newSurvey, frequency: e.target.value as Survey['frequency'] })}
            >
              <MenuItem value="one_time">One Time</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="quarterly">Quarterly</MenuItem>
              <MenuItem value="annually">Annually</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateSurvey}>
            Create Survey
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Survey Dialog */}
      <Dialog 
        open={isViewDialogOpen} 
        onClose={() => setIsViewDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>{selectedSurvey?.title}</DialogTitle>
        <DialogContent>
          {selectedSurvey && (
            <Box>
              <Typography variant="body1" mb={2}>
                {selectedSurvey.description}
              </Typography>
              
              <Typography variant="h6" mb={2}>Survey Questions:</Typography>
              
              {selectedSurvey.questions.map((question, index) => (
                <Accordion key={question.id}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>
                      {index + 1}. {question.question}
                      {question.required && <span style={{ color: 'red' }}> *</span>}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Type:</strong> {question.type.replace('_', ' ')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Category:</strong> {question.category || 'General'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Required:</strong> {question.required ? 'Yes' : 'No'}
                      </Typography>
                      
                      {question.type === 'rating' && (
                        <Box mt={1}>
                          <Typography variant="body2">Sample rating:</Typography>
                          <Rating value={4} readOnly />
                        </Box>
                      )}
                      
                      {question.type === 'multiple_choice' && question.options && (
                        <Box mt={1}>
                          <Typography variant="body2">Options:</Typography>
                          {question.options.map((option, idx) => (
                            <Typography key={idx} variant="body2" sx={{ ml: 2 }}>
                              • {option}
                            </Typography>
                          ))}
                        </Box>
                      )}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Delete Survey</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{selectedSurvey?.title}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This action cannot be undone. All associated responses will also be deleted.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={() => selectedSurvey && handleDeleteSurvey(selectedSurvey.id)}
          >
            Delete Survey
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
    </Box>
  );
}
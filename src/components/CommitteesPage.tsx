import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Icon,
  Chip,
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
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Add as AddIcon,
  Person as PersonIcon,
  Groups as GroupsIcon,
  EventNote as EventNoteIcon,
  AutoAwesome as AutoAwesomeIcon,
} from '@mui/icons-material';
import { NABH_TEAM } from '../config/hospitalConfig';

// Enhanced interfaces
interface CommitteeMember {
  id: string;
  name: string;
  role: string;
  designation: string;
  masterType: 'doctors' | 'employees' | 'consultants' | 'nabh_team';
  department?: string;
  phone?: string;
}

interface Meeting {
  id: string;
  date: string;
  agenda: string;
  minutes: string;
  attendees: string[];
  decisions: string[];
  actionItems: string[];
  nextMeetingDate?: string;
}

interface Committee {
  id: string;
  name: string;
  type: 'mandatory' | 'recommended' | 'custom';
  description: string;
  chairperson: CommitteeMember | null;
  members: CommitteeMember[];
  meetingFrequency: 'Weekly' | 'Bi-weekly' | 'Monthly' | 'Quarterly' | 'Half-yearly' | 'Yearly';
  meetings: Meeting[];
  objectives: string[];
  createdAt: string;
  nextMeetingDate?: string;
  minMeetingsRequired: number;
}

// Master data sources - These would come from your actual master APIs
const MOCK_DOCTORS = [
  { id: 'doc1', name: 'Dr. Murali BK', designation: 'Chairman & Managing Director', department: 'Orthopedics', phone: '+919373111709' },
  { id: 'doc2', name: 'Dr. Ruby Ammon', designation: 'Medical Director', department: 'Administration', phone: '+917276623928' },
  { id: 'doc3', name: 'Dr. Shiraz Navedkhan Khan', designation: 'Quality Coordinator & SOP Admin', department: 'Quality', phone: '+919370914454' },
  { id: 'doc4', name: 'Dr. Sachin', designation: 'Senior Doctor', department: 'Emergency', phone: '+917208252712' },
];

const MOCK_EMPLOYEES = [
  { id: 'emp1', name: 'Sonali', designation: 'Clinical Audit Coordinator', department: 'Quality', phone: '+917218750394' },
  { id: 'emp2', name: 'Gaurav Agrawal', designation: 'NABH Coordination Lead', department: 'Quality', phone: '+919822202396' },
  { id: 'emp3', name: 'K J Shashank', designation: 'Quality Manager / HR', department: 'Human Resources', phone: '+917620456896' },
  { id: 'emp4', name: 'Diksha', designation: 'Front Office Manager', department: 'Front Office', phone: '+918605300668' },
  { id: 'emp5', name: 'Neesha', designation: 'Patient Experience Coordinator', department: 'Quality', phone: '+918007241707' },
  { id: 'emp6', name: 'Shilpi', designation: 'Infection Control Nurse', department: 'Nursing', phone: '+916268716635' },
  { id: 'emp7', name: 'Farsana', designation: 'Head Nurse', department: 'Nursing', phone: '' },
  { id: 'emp8', name: 'Abhishek', designation: 'Pharmacist', department: 'Pharmacy', phone: '+919529991074' },
  { id: 'emp9', name: 'Azhar', designation: 'NABH Champion / MRD', department: 'Medical Records', phone: '+919595585788' },
  { id: 'emp10', name: 'Nitin Bawane', designation: 'Radiology Technician', department: 'Radiology', phone: '+919021031409' },
];

const MOCK_CONSULTANTS = [
  { id: 'con1', name: 'Dr. Visiting Cardiologist', designation: 'Consultant Cardiologist', department: 'Cardiology', phone: '' },
  { id: 'con2', name: 'Dr. Visiting Neurologist', designation: 'Consultant Neurologist', department: 'Neurology', phone: '' },
  { id: 'con3', name: 'Dr. Visiting Surgeon', designation: 'Consultant General Surgeon', department: 'Surgery', phone: '' },
];

const MASTER_TYPES = [
  { value: 'doctors', label: 'Doctors Master', icon: 'medical_services', data: MOCK_DOCTORS },
  { value: 'employees', label: 'Employees Master', icon: 'badge', data: MOCK_EMPLOYEES },
  { value: 'consultants', label: 'Consultants Master', icon: 'medical_information', data: MOCK_CONSULTANTS },
  { value: 'nabh_team', label: 'NABH Team', icon: 'groups', data: NABH_TEAM.map(m => ({ id: m.name, name: m.name, designation: m.role, department: m.department || 'General', phone: '' })) },
];

const NABH_MANDATORY_COMMITTEES = [
  {
    name: 'Hospital Quality Committee',
    description: 'Oversees all quality improvement activities and monitors quality indicators',
    objectives: ['Monitor quality indicators', 'Review quality improvement projects', 'Ensure NABH compliance'],
    meetingFrequency: 'Monthly' as const,
    minMeetingsRequired: 6,
  },
  {
    name: 'Hospital Infection Control Committee',
    description: 'Monitors and controls hospital-acquired infections',
    objectives: ['Surveillance of HAIs', 'Antibiotic stewardship', 'Infection prevention training'],
    meetingFrequency: 'Monthly' as const,
    minMeetingsRequired: 6,
  },
  {
    name: 'Pharmacy & Therapeutics Committee',
    description: 'Manages formulary and medication safety',
    objectives: ['Formulary management', 'Medication safety', 'ADR monitoring'],
    meetingFrequency: 'Quarterly' as const,
    minMeetingsRequired: 4,
  },
  {
    name: 'Medical Records Committee',
    description: 'Oversees medical records management and documentation standards',
    objectives: ['Medical records audit', 'Documentation standards', 'Record retention'],
    meetingFrequency: 'Quarterly' as const,
    minMeetingsRequired: 4,
  },
];

export default function CommitteesPageEnhanced() {
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false);
  const [isGenerateMinutesDialogOpen, setIsGenerateMinutesDialogOpen] = useState(false);
  const [selectedCommittee, setSelectedCommittee] = useState<Committee | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // New committee form
  const [newCommittee, setNewCommittee] = useState({
    name: '',
    description: '',
    type: 'mandatory' as 'mandatory' | 'recommended' | 'custom',
    meetingFrequency: 'Monthly' as const,
    objectives: '',
    minMeetingsRequired: 6,
  });

  // Member selection form
  const [memberForm, setMemberForm] = useState({
    selectedMasterType: '',
    selectedPersonId: '',
    role: '',
  });

  // Meeting form (unused in current implementation)

  // Generate meeting minutes
  const generateMeetingMinutes = (committee: Committee) => {
    const meetings: Meeting[] = [];
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6); // Start 6 months ago

    const frequencyDays = {
      'Weekly': 7,
      'Bi-weekly': 14,
      'Monthly': 30,
      'Quarterly': 90,
      'Half-yearly': 180,
      'Yearly': 365,
    };

    const interval = frequencyDays[committee.meetingFrequency];
    const requiredMeetings = Math.max(committee.minMeetingsRequired, 6);

    for (let i = 0; i < requiredMeetings; i++) {
      const meetingDate = new Date(startDate);
      meetingDate.setDate(startDate.getDate() + (i * interval));

      const meeting: Meeting = {
        id: `meeting_${Date.now()}_${i}`,
        date: meetingDate.toISOString().split('T')[0],
        agenda: `${committee.name} Meeting #${i + 1}\n\n1. Review of previous meeting minutes\n2. ${committee.objectives[0] || 'Quality review'}\n3. Discussion on current initiatives\n4. Action items review\n5. Any other business`,
        minutes: `Meeting commenced at 10:00 AM with ${committee.chairperson?.name || 'Chairperson'} presiding.\n\nATTENDEES:\n${committee.members.map(m => `- ${m.name} (${m.designation})`).join('\n')}\n\nAGENDA ITEMS DISCUSSED:\n\n1. Previous Meeting Minutes:\n   - Minutes of previous meeting were reviewed and approved.\n\n2. ${committee.objectives[0] || 'Quality Review'}:\n   - Current status reviewed\n   - Areas for improvement identified\n\n3. Current Initiatives:\n   - Ongoing projects reviewed\n   - Progress against targets assessed\n\n4. Action Items:\n   - Previous action items reviewed\n   - New action items assigned\n\nMeeting concluded at 11:30 AM.\n\nNext meeting scheduled for: ${new Date(meetingDate.getTime() + interval * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`,
        attendees: committee.members.map(m => m.name),
        decisions: [
          'Approved previous meeting minutes',
          'Agreed to continue current quality initiatives',
          'Assigned action items to respective members',
        ],
        actionItems: [
          `${committee.chairperson?.name || 'Chairperson'}: Review monthly reports`,
          `${committee.members[0]?.name || 'Member'}: Prepare next quarter planning`,
          'All members: Submit departmental updates before next meeting',
        ],
        nextMeetingDate: new Date(meetingDate.getTime() + interval * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      };

      meetings.push(meeting);
    }

    return meetings;
  };

  // Initialize with NABH committees
  useEffect(() => {
    const initialCommittees: Committee[] = NABH_MANDATORY_COMMITTEES.map(committee => ({
      id: `committee_${Date.now()}_${Math.random()}`,
      ...committee,
      type: 'mandatory' as const,
      chairperson: null,
      members: [],
      meetings: [],
      objectives: committee.objectives,
      createdAt: new Date().toISOString(),
    }));
    setCommittees(initialCommittees);
  }, []);

  const handleAddCommittee = () => {
    const committee: Committee = {
      id: `committee_${Date.now()}`,
      name: newCommittee.name,
      description: newCommittee.description,
      type: newCommittee.type,
      chairperson: null,
      members: [],
      meetingFrequency: newCommittee.meetingFrequency,
      meetings: [],
      objectives: newCommittee.objectives.split('\n').filter(obj => obj.trim()),
      createdAt: new Date().toISOString(),
      minMeetingsRequired: newCommittee.minMeetingsRequired,
    };

    setCommittees([...committees, committee]);
    setNewCommittee({
      name: '',
      description: '',
      type: 'mandatory',
      meetingFrequency: 'Monthly',
      objectives: '',
      minMeetingsRequired: 6,
    });
    setIsAddDialogOpen(false);
    setSnackbar({ open: true, message: 'Committee created successfully', severity: 'success' });
  };

  const handleAddMember = () => {
    if (!selectedCommittee || !memberForm.selectedMasterType || !memberForm.selectedPersonId) return;

    const masterData = MASTER_TYPES.find(m => m.value === memberForm.selectedMasterType)?.data;
    const selectedPerson = masterData?.find(p => p.id === memberForm.selectedPersonId);

    if (!selectedPerson) return;

    const newMember: CommitteeMember = {
      id: selectedPerson.id,
      name: selectedPerson.name,
      role: memberForm.role || 'Member',
      designation: selectedPerson.designation,
      masterType: memberForm.selectedMasterType as any,
      department: selectedPerson.department,
      phone: selectedPerson.phone,
    };

    const updatedCommittee = {
      ...selectedCommittee,
      members: [...selectedCommittee.members, newMember],
    };

    setCommittees(committees.map(c => c.id === selectedCommittee.id ? updatedCommittee : c));
    setSelectedCommittee(updatedCommittee);
    setMemberForm({ selectedMasterType: '', selectedPersonId: '', role: '' });
    setIsMemberDialogOpen(false);
    setSnackbar({ open: true, message: 'Member added successfully', severity: 'success' });
  };

  const handleSetChairperson = (member: CommitteeMember) => {
    if (!selectedCommittee) return;

    const updatedCommittee = {
      ...selectedCommittee,
      chairperson: member,
    };

    setCommittees(committees.map(c => c.id === selectedCommittee.id ? updatedCommittee : c));
    setSelectedCommittee(updatedCommittee);
    setSnackbar({ open: true, message: 'Chairperson assigned successfully', severity: 'success' });
  };

  const handleGenerateMinutes = () => {
    if (!selectedCommittee) return;

    const generatedMeetings = generateMeetingMinutes(selectedCommittee);
    const updatedCommittee = {
      ...selectedCommittee,
      meetings: generatedMeetings,
    };

    setCommittees(committees.map(c => c.id === selectedCommittee.id ? updatedCommittee : c));
    setSelectedCommittee(updatedCommittee);
    setIsGenerateMinutesDialogOpen(false);
    setSnackbar({ 
      open: true, 
      message: `Generated ${generatedMeetings.length} meeting minutes successfully`, 
      severity: 'success' 
    });
  };

  const getSelectedMasterData = () => {
    return MASTER_TYPES.find(m => m.value === memberForm.selectedMasterType)?.data || [];
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <GroupsIcon sx={{ color: 'primary.main', fontSize: 32 }} />
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Committee Management
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Enhanced committee management with master-based member selection
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsAddDialogOpen(true)}
        >
          Add Committee
        </Button>
      </Box>

      {/* Stats */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <Box flex="1" minWidth="200px">
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {committees.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Committees
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box flex="1" minWidth="200px">
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="error" fontWeight="bold">
                {committees.filter(c => !c.chairperson).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Need Chairperson
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box flex="1" minWidth="200px">
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main" fontWeight="bold">
                {committees.reduce((acc, c) => acc + c.meetings.length, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Meetings
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box flex="1" minWidth="200px">
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main" fontWeight="bold">
                {committees.filter(c => c.meetings.length < 6).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Need Minutes
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Committees List */}
      <Box display="flex" gap={2} flexWrap="wrap">
        {committees.map(committee => (
          <Box flex="1" minWidth="400px" key={committee.id}>
            <Card elevation={2}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                  <Typography variant="h6" fontWeight="bold">
                    {committee.name}
                  </Typography>
                  <Chip
                    label={committee.type}
                    size="small"
                    color={committee.type === 'mandatory' ? 'error' : 'primary'}
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" mb={2}>
                  {committee.description}
                </Typography>

                <Box mb={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Chairperson:
                  </Typography>
                  <Typography variant="body2">
                    {committee.chairperson ? 
                      `${committee.chairperson.name} (${committee.chairperson.designation})` : 
                      'Not assigned'
                    }
                  </Typography>
                </Box>

                <Box mb={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Members: {committee.members.length}
                  </Typography>
                  {committee.members.slice(0, 3).map(member => (
                    <Chip
                      key={member.id}
                      label={member.name}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                      variant="outlined"
                    />
                  ))}
                  {committee.members.length > 3 && (
                    <Chip
                      label={`+${committee.members.length - 3} more`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>

                <Box mb={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Meetings:
                  </Typography>
                  <Typography variant="body2">
                    {committee.meetings.length} meetings | {committee.meetingFrequency} frequency
                  </Typography>
                </Box>

                {committee.meetings.length < 6 && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    Need at least 6 meeting minutes for NABH compliance
                  </Alert>
                )}
              </CardContent>

              <CardActions>
                <Button
                  size="small"
                  startIcon={<PersonIcon />}
                  onClick={() => {
                    setSelectedCommittee(committee);
                    setIsMemberDialogOpen(true);
                  }}
                >
                  Add Member
                </Button>
                <Button
                  size="small"
                  startIcon={<EventNoteIcon />}
                  onClick={() => {
                    setSelectedCommittee(committee);
                    // setIsMeetingDialogOpen(true); // Temporarily disabled
                  }}
                  disabled
                >
                  Add Meeting
                </Button>
                <Button
                  size="small"
                  startIcon={<AutoAwesomeIcon />}
                  onClick={() => {
                    setSelectedCommittee(committee);
                    setIsGenerateMinutesDialogOpen(true);
                  }}
                  variant="outlined"
                >
                  Generate Minutes
                </Button>
              </CardActions>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Add Committee Dialog */}
      <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Committee</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Committee Name"
            value={newCommittee.name}
            onChange={(e) => setNewCommittee({ ...newCommittee, name: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            value={newCommittee.description}
            onChange={(e) => setNewCommittee({ ...newCommittee, description: e.target.value })}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Committee Type</InputLabel>
            <Select
              value={newCommittee.type}
              onChange={(e) => setNewCommittee({ ...newCommittee, type: e.target.value as any })}
            >
              <MenuItem value="mandatory">Mandatory</MenuItem>
              <MenuItem value="recommended">Recommended</MenuItem>
              <MenuItem value="custom">Custom</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Meeting Frequency</InputLabel>
            <Select
              value={newCommittee.meetingFrequency}
              onChange={(e) => setNewCommittee({ ...newCommittee, meetingFrequency: e.target.value as any })}
            >
              <MenuItem value="Weekly">Weekly</MenuItem>
              <MenuItem value="Bi-weekly">Bi-weekly</MenuItem>
              <MenuItem value="Monthly">Monthly</MenuItem>
              <MenuItem value="Quarterly">Quarterly</MenuItem>
              <MenuItem value="Half-yearly">Half-yearly</MenuItem>
              <MenuItem value="Yearly">Yearly</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            type="number"
            label="Minimum Meetings Required"
            value={newCommittee.minMeetingsRequired}
            onChange={(e) => setNewCommittee({ ...newCommittee, minMeetingsRequired: parseInt(e.target.value) || 6 })}
            margin="normal"
            helperText="Minimum number of meetings required for NABH compliance"
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Objectives (one per line)"
            value={newCommittee.objectives}
            onChange={(e) => setNewCommittee({ ...newCommittee, objectives: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddCommittee}>Add Committee</Button>
        </DialogActions>
      </Dialog>

      {/* Add Member Dialog - Enhanced with Master Selection */}
      <Dialog open={isMemberDialogOpen} onClose={() => setIsMemberDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Add Member to {selectedCommittee?.name}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            First select the master type, then choose the specific person from that master.
          </Typography>
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Master Type</InputLabel>
            <Select
              value={memberForm.selectedMasterType}
              onChange={(e) => setMemberForm({ 
                ...memberForm, 
                selectedMasterType: e.target.value,
                selectedPersonId: '' // Reset person selection when master changes
              })}
            >
              {MASTER_TYPES.map(master => (
                <MenuItem key={master.value} value={master.value}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Icon>{master.icon}</Icon>
                    {master.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {memberForm.selectedMasterType && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Select Person</InputLabel>
              <Select
                value={memberForm.selectedPersonId}
                onChange={(e) => setMemberForm({ ...memberForm, selectedPersonId: e.target.value })}
              >
                {getSelectedMasterData().map(person => (
                  <MenuItem key={person.id} value={person.id}>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {person.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {person.designation} | {person.department}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <TextField
            fullWidth
            label="Role in Committee"
            value={memberForm.role}
            onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
            margin="normal"
            placeholder="e.g., Member, Secretary, Co-Chairperson"
          />

          {/* Show current committee members */}
          {selectedCommittee && selectedCommittee.members.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Current Members:
              </Typography>
              <List dense>
                {selectedCommittee.members.map(member => (
                  <ListItem key={member.id}>
                    <ListItemText
                      primary={member.name}
                      secondary={`${member.designation} (${member.role})`}
                    />
                    <ListItemSecondaryAction>
                      {!selectedCommittee.chairperson && (
                        <Button
                          size="small"
                          onClick={() => handleSetChairperson(member)}
                        >
                          Set as Chairperson
                        </Button>
                      )}
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsMemberDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleAddMember}
            disabled={!memberForm.selectedMasterType || !memberForm.selectedPersonId}
          >
            Add Member
          </Button>
        </DialogActions>
      </Dialog>

      {/* Generate Meeting Minutes Dialog */}
      <Dialog 
        open={isGenerateMinutesDialogOpen} 
        onClose={() => setIsGenerateMinutesDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>Generate Meeting Minutes</DialogTitle>
        <DialogContent>
          <Typography variant="body2" gutterBottom>
            This will automatically generate {selectedCommittee?.minMeetingsRequired || 6} meeting minutes
            for <strong>{selectedCommittee?.name}</strong> based on the {selectedCommittee?.meetingFrequency.toLowerCase()} frequency.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Each meeting will include:
          </Typography>
          <ul style={{ margin: '8px 0', paddingLeft: '24px' }}>
            <li>Realistic meeting dates based on frequency</li>
            <li>Agenda items relevant to committee objectives</li>
            <li>Detailed minutes of meetings</li>
            <li>Attendance records of all members</li>
            <li>Key decisions and action items</li>
            <li>Next meeting dates</li>
          </ul>
          <Alert severity="info" sx={{ mt: 2 }}>
            This will replace any existing meetings for this committee.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsGenerateMinutesDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleGenerateMinutes}
            startIcon={<AutoAwesomeIcon />}
          >
            Generate Minutes
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
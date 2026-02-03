import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import Icon from '@mui/material/Icon';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNABHStore } from '../store/nabhStore';
import { getChapterStats } from '../data/nabhData';

const MANAGEMENT_SECTIONS = [
  { id: 'stationery', label: 'Stationery', icon: 'inventory_2', path: '/stationery', description: 'Hospital forms & documents' },
  { id: 'committees', label: 'Committees', icon: 'groups', path: '/committees', description: 'Manage hospital committees' },
  { id: 'departments', label: 'Departments', icon: 'apartment', path: '/departments', description: 'Hospital departments master' },
  { id: 'equipment', label: 'Equipment', icon: 'medical_services', path: '/equipment', description: 'Medical equipment inventory' },
  { id: 'manuals', label: 'Hospital Manuals', icon: 'menu_book', path: '/manuals', description: 'Manage hospital policies, procedures & operational manuals' },
  { id: 'licenses', label: 'Licenses & Statutory', icon: 'gavel', path: '/licenses', description: 'Track hospital licenses, certificates & statutory requirements with expiry monitoring' },
  { id: 'mous', label: 'MOUs & Partnerships', icon: 'handshake', path: '/mous', description: 'Manage Memoranda of Understanding and strategic partnerships with multiple document support' },
  { id: 'programs', label: 'Hospital Programs', icon: 'local_hospital', path: '/programs', description: 'Manage hospital programs and initiatives' },
  { id: 'clinical-audits', label: 'Clinical Audits', icon: 'fact_check', path: '/clinical-audits', description: 'Manage clinical audits and quality assessments' },
  { id: 'surveys', label: 'Surveys', icon: 'poll', path: '/surveys', description: 'Manage patient & staff satisfaction surveys and quality assessments' },
  { id: 'evidence-prompt', label: 'Evidence Prompt Master', icon: 'assignment', path: '/evidence-prompt', description: 'NABH evidence generation prompts & templates' },
  { id: 'kpis', label: 'KPIs', icon: 'analytics', path: '/kpis', description: 'Quality indicators' },
  { id: 'presentations', label: 'Slide Decks', icon: 'slideshow', path: '/presentations', description: 'Auditor presentations' },
  { id: 'patients', label: 'Patients', icon: 'personal_injury', path: '/patients', description: 'Manage patient records' },
  { id: 'employees', label: 'Employees', icon: 'badge', path: '/employees', description: 'Manage hospital staff' },
  { id: 'consultants', label: 'Visiting Consultants', icon: 'medical_information', path: '/consultants', description: 'Manage visiting doctors' },
  { id: 'doctors', label: 'Resident Doctors', icon: 'medication_liquid', path: '/doctors', description: 'Manage RMOs and full-time doctors' },
  { id: 'nabh-master', label: 'NABH Master', icon: 'edit_note', path: '/nabh-master', description: 'Manage chapters, standards & elements' },
  { id: 'migration', label: 'Data Migration', icon: 'upload_file', path: '/migration', description: 'Import NABH standards data' },
];

const drawerWidth = 280;

const chapterIcons: Record<string, string> = {
  AAC: 'accessible',
  COP: 'medical_services',
  MOM: 'medication',
  PRE: 'person',
  HIC: 'sanitizer',
  CQI: 'verified',
  PSQ: 'verified',
  ROM: 'business',
  FMS: 'apartment',
  HRM: 'groups',
  IMS: 'storage',
};

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const { chapters, selectedChapter, setSelectedChapter } = useNABHStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChapterClick = (chapterId: string) => {
    setSelectedChapter(chapterId);
    navigate('/');
    onClose();
  };

  const handleSectionClick = (path: string) => {
    setSelectedChapter('');
    navigate(path);
    onClose();
  };

  const drawerContent = (
    <Box>
      <Toolbar />
      {/* Management Sections */}
      <Box sx={{ p: 2, pb: 1 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          MANAGEMENT
        </Typography>
      </Box>
      <List dense>
        {MANAGEMENT_SECTIONS.map((section) => (
          <ListItem key={section.id} disablePadding>
            <ListItemButton
              selected={location.pathname === section.path}
              onClick={() => handleSectionClick(section.path)}
              sx={{ py: 1 }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Icon color={location.pathname === section.path ? 'primary' : 'inherit'}>
                  {section.icon}
                </Icon>
              </ListItemIcon>
              <Tooltip title={section.description} placement="right" arrow>
                <ListItemText
                  primary={section.label}
                  slotProps={{
                    primary: { fontWeight: location.pathname === section.path ? 600 : 400, fontSize: '0.875rem' },
                  }}
                />
              </Tooltip>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 1 }} />
      {/* Chapters Section */}
      <Box sx={{ p: 2, pb: 1 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          CHAPTERS
        </Typography>
      </Box>
      <List>
        {chapters.map((chapter) => {
          const stats = getChapterStats(chapter);
          const progress = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

          return (
            <ListItem key={chapter.id} disablePadding>
              <ListItemButton
                selected={selectedChapter === chapter.id}
                onClick={() => handleChapterClick(chapter.id)}
                sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 1.5 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Icon color={selectedChapter === chapter.id ? 'primary' : 'inherit'}>
                      {chapterIcons[chapter.code] || 'folder'}
                    </Icon>
                  </ListItemIcon>
                  <Tooltip
                    title={chapter.fullName}
                    arrow
                    placement="right"
                    enterDelay={300}
                    slotProps={{
                      tooltip: {
                        sx: {
                          maxWidth: 300,
                          fontSize: '0.75rem',
                        },
                      },
                    }}
                  >
                    <ListItemText
                      primary={chapter.code}
                      secondary={chapter.fullName}
                      slotProps={{
                        primary: { fontWeight: 600 },
                        secondary: { variant: 'caption', noWrap: true },
                      }}
                    />
                  </Tooltip>
                </Box>
                <Box sx={{ width: '100%', px: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      {stats.completed}/{stats.total} completed
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {Math.round(progress)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{ height: 4, borderRadius: 2 }}
                  />
                  <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                    {stats.core > 0 && (
                      <Chip label={`${stats.core} Core`} size="small" color="error" sx={{ height: 18, fontSize: 10 }} />
                    )}
                    {stats.prevNC > 0 && (
                      <Chip label={`${stats.prevNC} Prev NC`} size="small" color="warning" sx={{ height: 18, fontSize: 10 }} />
                    )}
                  </Box>
                </Box>
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}

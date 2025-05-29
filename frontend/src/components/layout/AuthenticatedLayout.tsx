// AuthenticatedLayout.tsx
import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { 
  Box, Drawer, CssBaseline, Toolbar, List, Divider, 
  ListItem, ListItemButton, ListItemIcon, ListItemText,
  AppBar, IconButton, Typography
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  ListAlt as AssetsIcon,
  CalendarToday as MaintenanceIcon,
  Logout as LogoutIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

export default function AuthenticatedLayout() {
  const [open, setOpen] = useState(true);
  const { logout, user } = useAuth();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'background.paper',
          color: 'text.primary',
          boxShadow: 'none',
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Asset Maintenance
          </Typography>
          <Typography>Olá, {user?.username}!</Typography>
        </Toolbar>
      </AppBar>
      
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <Toolbar />
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/">
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/assets">
              <ListItemIcon>
                <AssetsIcon />
              </ListItemIcon>
              <ListItemText primary="Ativos" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/maintenances">
              <ListItemIcon>
                <MaintenanceIcon />
              </ListItemIcon>
              <ListItemText primary="Manutenções" />
            </ListItemButton>
          </ListItem>
        </List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/maintenance-schedules">
            <ListItemIcon>
              <ScheduleIcon />
            </ListItemIcon>
            <ListItemText primary="Agendamentos" />
          </ListItemButton>
        </ListItem>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/settings">
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Configurações" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={logout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Sair" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      
      <Main open={open}>
        <Toolbar />
        <Outlet /> 
      </Main>
    </Box>
  );
}
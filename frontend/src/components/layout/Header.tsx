import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Asset Maintenance
        </Typography>
        {user && (
          <Button color="inherit" onClick={logout}>
            Sair
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
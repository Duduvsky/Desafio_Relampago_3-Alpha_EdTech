import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, TextField, Typography, Container, Box, Paper, Grid } from '@mui/material';
import { PersonAdd } from '@mui/icons-material';
import api from '../../config/api';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/users', { username, email, password });
      navigate('/login');
    } catch (err: unknown) {
      interface ApiError {
        response?: {
          data?: {
            error?: string;
          };
        };
      }

      if (
        err &&
        typeof err === 'object' &&
        'response' in err &&
        (err as ApiError).response?.data?.error
      ) {
        setError((err as ApiError).response!.data!.error!);
      } else {
        setError('Erro ao cadastrar. Tente novamente.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <PersonAdd color="primary" sx={{ fontSize: 40, mb: 2 }} />
        <Typography component="h1" variant="h5">
          Cadastro
        </Typography>
        
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Nome de usuário"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Senha"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? 'Carregando...' : 'Cadastrar'}
          </Button>
          
          <Grid container justifyContent="flex-end">
            {/* <Grid item> */}
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary">
                  Já tem uma conta? Faça login
                </Typography>
              </Link>
            {/* </Grid> */}
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}
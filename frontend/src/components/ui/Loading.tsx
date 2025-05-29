import { CircularProgress, Box } from '@mui/material';

export default function Loading() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh" // Alterado de 100vh para 200px para teste
    >
      <CircularProgress size={60} />
    </Box>
  );
}
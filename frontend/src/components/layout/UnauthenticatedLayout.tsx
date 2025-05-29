import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

export default function UnauthenticatedLayout() {
  return (
    <Box>
      <Outlet /> 
    </Box>
  );
}
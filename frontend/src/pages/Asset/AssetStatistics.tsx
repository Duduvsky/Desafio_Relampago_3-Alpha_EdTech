import { Box, Typography, Grid } from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon,
//   Warning as WarningIcon,
//   Error as ErrorIcon
} from '@mui/icons-material';

interface AssetStatisticsProps {
  statistics: {
    completed: number;
    // Adicione outras propriedades conforme necessário
  };
}

export default function AssetStatistics({ statistics }: AssetStatisticsProps) {
  return (
    <Grid container spacing={3}>
      <Grid >
        <Box display="flex" alignItems="center">
          <CheckCircleIcon color="success" sx={{ fontSize: 40, mr: 2 }} />
          <Box>
            <Typography variant="h6">Manutenções Concluídas</Typography>
            <Typography variant="h4">{statistics.completed}</Typography>
          </Box>
        </Box>
      </Grid>
      {/* Adicione mais estatísticas conforme necessário */}
    </Grid>
  );
}
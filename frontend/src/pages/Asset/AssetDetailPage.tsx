import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert, Tab, Tabs,Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { AssetService } from '../../services/asset.service';
import MaintenanceLogList from './MaintenanceLogList';
import MaintenanceScheduleList from './MaintenanceScheduleList';
import type { MaintenanceSchedule } from './MaintenanceScheduleList';

import type { MaintenanceLog } from './MaintenanceLogList';

interface AssetWithDetails {
  id: number;
  name: string;
  description: string;
  created_at: string;
  maintenanceLogs: MaintenanceLog[];
  maintenanceSchedules: MaintenanceSchedule[];
  statistics: {
    totalMaintenance: number;
    completedMaintenance: number;
    pendingMaintenance: number;
    totalCost: number;
  };
}

export default function AssetDetailPage() {
  const { id } = useParams();
  const [asset, setAsset] = useState<AssetWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchAsset = async () => {
        try {
        setLoading(true);
        const data = await AssetService.getAssetWithMaintenance(Number(id));
        setAsset(data as AssetWithDetails); // Type assertion
        } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar ativo');
        } finally {
        setLoading(false);
        }
    };
    fetchAsset();
  }, [id]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!asset) return <Alert severity="warning">Ativo não encontrado</Alert>;

  return (
    <Box sx={{ p: 3 }}>
      <Button
        component={Link}
        to="/assets"
        startIcon={<ArrowBack />}
        sx={{ mb: 2 }}
      >
        Voltar para lista de ativos
      </Button>

      <Typography variant="h4" gutterBottom>
        {asset.name}
      </Typography>
      <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
        {asset.description}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Cadastrado em: {new Date(asset.created_at).toLocaleDateString()}
      </Typography>
      
      <Paper sx={{ mt: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={(_, newValue) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Histórico de Manutenções" />
          <Tab label="Agendamentos" />
          <Tab label="Estatísticas" />
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {tabValue === 0 && (
            <MaintenanceLogList logs={asset.maintenanceLogs} />
          )}
          
          {tabValue === 1 && (
            <MaintenanceScheduleList schedules={asset.maintenanceSchedules} />
          )}
          
          {tabValue === 2 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <StatCard 
                title="Total de Manutenções"
                value={asset.statistics.totalMaintenance}
                icon="📊"
              />
              <StatCard 
                title="Concluídas"
                value={asset.statistics.completedMaintenance}
                icon="✅"
                color="#4caf50"
              />
              <StatCard 
                title="Pendentes"
                value={asset.statistics.pendingMaintenance}
                icon="⏳"
                color="#ff9800"
              />
              <StatCard 
                title="Custo Total"
                value={`R$ ${asset.statistics.totalCost.toFixed(2)}`}
                icon="💰"
                color="#2196f3"
              />
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
}

// Componente auxiliar para as estatísticas
function StatCard({ title, value, icon, color = '#555' }: { 
  title: string; 
  value: string | number; 
  icon: string;
  color?: string;
}) {
  return (
    <Paper sx={{ 
      p: 3, 
      minWidth: 200, 
      flex: 1, 
      display: 'flex', 
      alignItems: 'center',
      gap: 2
    }}>
      <Box sx={{ 
        fontSize: 24,
        color
      }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          {value}
        </Typography>
      </Box>
    </Paper>
  );
}
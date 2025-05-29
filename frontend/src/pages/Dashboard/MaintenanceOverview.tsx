import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Timeline, TimelineDot, TimelineItem, TimelineContent, TimelineSeparator } from '@mui/lab';
import { CheckCircle, Warning, Error } from '@mui/icons-material';
import { useDashboardData } from '../../hooks/useDashboardData';
import CircularProgress from '@mui/material/CircularProgress';

interface RecentActivity {
  time: string;
  text: string;
}

export default function MaintenanceOverview() {
  const { data, loading, error } = useDashboardData();

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  const stats = [
    { title: 'Ativos Cadastrados', value: data.maintenanceStats.totalAssets, icon: <CheckCircle color="primary" /> },
    { title: 'Manutenções Pendentes', value: data.maintenanceStats.pendingMaintenance, icon: <Warning color="warning" /> },
    { title: 'Manutenções Atrasadas', value: data.maintenanceStats.overdueMaintenance, icon: <Error color="error" /> },
    { title: 'Manutenções Concluídas', value: data.maintenanceStats.completedMaintenance, icon: <CheckCircle color="success" /> },
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Visão Geral
        </Typography>
        
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid key={index}>
              <Card variant="outlined">
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ fontSize: 40 }}>{stat.icon}</Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                    <Typography variant="h5">{stat.value}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Atividades Recentes
          </Typography>
          <Timeline>
            {data.recentActivities.map((activity: RecentActivity, index: number) => (
              <TimelineItem key={index}>
              <TimelineSeparator>
                <TimelineDot color="primary" />
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="body2" color="text.secondary">
                {activity.time}
                </Typography>
                <Typography>{activity.text}</Typography>
              </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </Box>
      </CardContent>
    </Card>
  );
}
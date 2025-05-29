import { type ReactElement } from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Chip, Box, CircularProgress } from '@mui/material';
import { Schedule, Warning, Error } from '@mui/icons-material';
import { useDashboardData } from '../../hooks/useDashboardData';

export default function UpcomingMaintenance() {
  const { data, loading, error } = useDashboardData();

  const getStatusChip = (dueDate: string | null): ReactElement => {
    if (!dueDate) {
      return (
        <Chip
          icon={<Warning fontSize="small" />}
          label="Sem data"
          color="default"
          size="small"
          variant="outlined"
        />
      );
    }

    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (due < today) {
      return (
        <Chip
          icon={<Error fontSize="small" />}
          label="Atrasado"
          color="error"
          size="small"
          variant="outlined"
        />
      );
    }

    return (
      <Chip
        icon={<Schedule fontSize="small" />}
        label="Pendente"
        color="warning"
        size="small"
        variant="outlined"
      />
    );
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Próximas Manutenções
        </Typography>
        
        <List>
          {data.upcomingMaintenance.map((item) => (
            <ListItem key={item.id} divider>
              <ListItemText
                primary={`Ativo #${item.asset_id} - ${item.asset_name}`}
                secondary={
                  <Box component="span" display="flex" flexDirection="column">
                    <span>{item.service_name}</span>
                    {item.due_date && (
                      <span>Vencimento: {new Date(item.due_date).toLocaleDateString()}</span>
                    )}
                  </Box>
                }
              />
              <Box ml={2}>
                {getStatusChip(item.due_date)}
              </Box>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import { Schedule, Warning, Error, CheckCircle } from '@mui/icons-material';

export interface MaintenanceSchedule {
  id: number;
  service_name: string;
  due_date: string | null;
  is_completed: boolean;
  due_condition?: string;
}

interface MaintenanceScheduleListProps {
  schedules: MaintenanceSchedule[];
}

export default function MaintenanceScheduleList({ schedules }: MaintenanceScheduleListProps) {
  const getStatusChip = (schedule: MaintenanceSchedule) => {
    if (schedule.is_completed) {
      return (
        <Chip
          icon={<CheckCircle fontSize="small" />}
          label="Concluído"
          color="success"
          size="small"
          variant="outlined"
        />
      );
    }

    if (!schedule.due_date) {
      return (
        <Chip
          icon={<Warning fontSize="small" />}
          label="Sem data"
          color="warning"
          size="small"
          variant="outlined"
        />
      );
    }

    const dueDate = new Date(schedule.due_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dueDate < today) {
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
        color="info"
        size="small"
        variant="outlined"
      />
    );
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Serviço</TableCell>
            <TableCell>Data Prevista</TableCell>
            <TableCell>Condição</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {schedules.map((schedule) => (
            <TableRow key={schedule.id}>
              <TableCell>{schedule.service_name}</TableCell>
              <TableCell>
                {schedule.due_date ? new Date(schedule.due_date).toLocaleDateString() : 'Não definida'}
              </TableCell>
              <TableCell>{schedule.due_condition || 'Não especificado'}</TableCell>
              <TableCell>
                {getStatusChip(schedule)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
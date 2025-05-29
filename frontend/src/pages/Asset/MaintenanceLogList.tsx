import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

export interface MaintenanceLog {
  id: string | number;
  service_name: string;
  service_date: string | Date;
  cost: number;
}

interface MaintenanceLogListProps {
  logs: MaintenanceLog[];
}

export default function MaintenanceLogList({ logs }: MaintenanceLogListProps) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Serviço</TableCell>
            <TableCell>Data</TableCell>
            <TableCell>Custo</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{log.service_name}</TableCell>
              <TableCell>{new Date(log.service_date).toLocaleDateString()}</TableCell>
              <TableCell>R$ {Number(log.cost).toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
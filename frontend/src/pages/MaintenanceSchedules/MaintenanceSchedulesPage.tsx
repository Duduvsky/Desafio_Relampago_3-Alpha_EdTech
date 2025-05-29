import { useState, useEffect } from 'react';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Button, CircularProgress, Alert,
  TextField, InputAdornment, IconButton, TablePagination, Snackbar
} from '@mui/material';
import { Add, Search, Edit, Delete, Check } from '@mui/icons-material';
import { MaintenanceScheduleService } from '../../services/maintenanceSchedule.service';
import { MaintenanceService } from '../../services/maintenance.service';
import MaintenanceScheduleFormModal from './MaintenanceScheduleFormModal';
import { type MaintenanceSchedule, type MaintenanceScheduleCreateData, type MaintenanceScheduleUpdateData } from '../../interfaces/maintenanceSchedule';
import CompleteMaintenanceModal from './CompleteMaintenanceModal';

type MaintenanceScheduleFormData = {
  asset_id: number;
  service_name: string;
  due_date?: string | null;
  due_condition?: string | null;
  is_completed?: boolean;
};

export default function MaintenanceSchedulesPage() {
  const [schedules, setSchedules] = useState<MaintenanceSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<MaintenanceSchedule | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  const [completingSchedule, setCompletingSchedule] = useState<MaintenanceSchedule | null>(null);

  const handleCompleteClick = (id: number) => {
    const schedule = schedules.find(s => s.id === id);
    setCompletingSchedule(schedule || null);
  };

  const handleConfirmComplete = async (cost: number) => {
    try {
      if (!completingSchedule) return;
      
      // 1. Cria o log de manutenção
      const maintenance = await MaintenanceService.createMaintenance({
        asset_id: completingSchedule.asset_id,
        service_name: completingSchedule.service_name,
        service_date: new Date().toISOString().split('T')[0],
        description: `Manutenção agendada concluída`,
        cost: cost
      });
    
      // 2. Marca o agendamento como concluído (vinculando ao log)
      await MaintenanceScheduleService.markAsCompleted(
        completingSchedule.id, 
        maintenance.id
      );
      
      // 3. Atualiza a lista
      fetchSchedules();
      setSnackbar({
        open: true,
        message: 'Manutenção marcada como concluída!',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : 'Erro ao marcar como concluída',
        severity: 'error'
      });
    }
  };

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const data = await MaintenanceScheduleService.getAllSchedules();
      setSchedules(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar agendamentos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleSubmitSchedule = async (
    data: MaintenanceSchedule | MaintenanceScheduleFormData
  ) => {
    try {
      if (editingSchedule) {
        // Atualização
        const updateData: MaintenanceScheduleUpdateData = {
          service_name: data.service_name,
          due_date: data.due_date || null,
          due_condition: data.due_condition || null,
          is_completed: data.is_completed
        };
        await MaintenanceScheduleService.updateSchedule(editingSchedule.id, updateData);
        setSnackbar({
          open: true,
          message: 'Agendamento atualizado com sucesso!',
          severity: 'success'
        });
      } else {
        // Criação
        const createData: MaintenanceScheduleCreateData = {
          asset_id: data.asset_id,
          service_name: data.service_name,
          due_date: data.due_date || undefined,
          due_condition: data.due_condition || undefined,
          is_completed: false
        };
        await MaintenanceScheduleService.createSchedule(createData);
        setSnackbar({
          open: true,
          message: 'Agendamento criado com sucesso!',
          severity: 'success'
        });
      }
      fetchSchedules();
      setOpenModal(false);
      setEditingSchedule(null);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : 'Erro ao salvar agendamento',
        severity: 'error'
      });
    }
  };

  const filteredSchedules = schedules.filter(schedule =>
    schedule.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (schedule.asset_id && schedule.asset_id.toString().includes(searchTerm))
  );

  const paginatedSchedules = filteredSchedules.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Agendamentos de Manutenção</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => {
            setEditingSchedule(null);
            setOpenModal(true);
          }}
        >
          Novo Agendamento
        </Button>
      </Box>

      <TextField
        label="Buscar agendamentos"
        variant="outlined"
        fullWidth
        sx={{ mb: 3 }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ativo</TableCell>
              <TableCell>Serviço</TableCell>
              <TableCell>Próxima Manutenção</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedSchedules.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell>Ativo #{schedule.asset_id} - {schedule.asset_name}</TableCell>
                <TableCell>{schedule.service_name}</TableCell>
                <TableCell>
                  {schedule.due_date ? new Date(schedule.due_date).toLocaleDateString() : schedule.due_condition}
                </TableCell>
                <TableCell>
                  {schedule.is_completed ? 'Concluído' : 'Pendente'}
                </TableCell>
                <TableCell>
                  {!schedule.is_completed && (
                      <IconButton onClick={() => handleCompleteClick(schedule.id)}>
                        <Check color="success" />
                      </IconButton>
                  )}
                  <IconButton onClick={() => {
                    setEditingSchedule(schedule);
                    setOpenModal(true);
                  }}>
                    <Edit color="primary" />
                  </IconButton>
                  <IconButton onClick={async () => {
                    try {
                      await MaintenanceScheduleService.deleteSchedule(schedule.id);
                      fetchSchedules();
                      setSnackbar({
                        open: true,
                        message: 'Agendamento deletado com sucesso!',
                        severity: 'success'
                      });
                    } catch (err) {
                      setSnackbar({
                        open: true,
                        message: err instanceof Error ? err.message : 'Erro ao deletar agendamento',
                        severity: 'error'
                      });
                    }
                  }}>
                    <Delete color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
          <CompleteMaintenanceModal
            open={!!completingSchedule}
            onClose={() => setCompletingSchedule(null)}
            onConfirm={handleConfirmComplete}
          />
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredSchedules.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />

      <MaintenanceScheduleFormModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditingSchedule(null);
        }}
        onSubmit={handleSubmitSchedule}
        initialData={editingSchedule || undefined}
        isEditing={!!editingSchedule}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({...snackbar, open: false})}
      >
        <Alert 
          onClose={() => setSnackbar({...snackbar, open: false})}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
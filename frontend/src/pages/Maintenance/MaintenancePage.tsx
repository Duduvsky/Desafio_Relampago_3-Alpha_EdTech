import { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress,
  Alert, TextField, InputAdornment, IconButton, TablePagination, Snackbar, Tab, Tabs } from '@mui/material';
import { Add, Search, Edit, Delete } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { MaintenanceService } from '../../services/maintenance.service';
import MaintenanceFormModal from './MaintenanceFormModal';
import { type MaintenanceLog } from '../../interfaces/maintenanceLog';
import { useNavigate } from 'react-router-dom';
import { MaintenanceScheduleService } from '../../services/maintenanceSchedule.service';
import { type MaintenanceSchedule } from '../../interfaces/maintenanceSchedule';

export default function MaintenancePage() {
  const [maintenances, setMaintenances] = useState<MaintenanceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState<MaintenanceLog | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  const [schedules, setSchedules] = useState<MaintenanceSchedule[]>([]);
  const navigate = useNavigate();

  // Função para buscar agendamentos
  const fetchSchedules = async () => {
    try {
      const data = await MaintenanceScheduleService.getAllSchedules();
      setSchedules(data);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : 'Erro ao carregar agendamentos',
        severity: 'error'
      });
    }
  };

  const fetchMaintenances = async () => {
    try {
      setLoading(true);
      const data = await MaintenanceService.getAllMaintenances();
      setMaintenances(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar manutenções');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tabValue === 0) {
      fetchMaintenances();
    } else {
      fetchSchedules();
    }
  }, [tabValue]);

  const handleSubmitMaintenance = async (maintenanceData: {
    asset_id: number;
    service_name: string;
    service_date: string;
    description: string;
    cost: number;
  }) => {
    try {
      if (editingMaintenance) {
        await MaintenanceService.updateMaintenance(editingMaintenance.id, maintenanceData);
        setSnackbar({
          open: true,
          message: 'Manutenção atualizada com sucesso!',
          severity: 'success'
        });
      } else {
        await MaintenanceService.createMaintenance(maintenanceData);
        setSnackbar({
          open: true,
          message: 'Manutenção criada com sucesso!',
          severity: 'success'
        });
      }
      fetchMaintenances();
      setOpenModal(false);
      setEditingMaintenance(null);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : 'Erro ao salvar manutenção',
        severity: 'error'
      });
    }
  };

  const handleEdit = (maintenance: MaintenanceLog) => {
    setEditingMaintenance({ ...maintenance }); 
    setOpenModal(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await MaintenanceService.deleteMaintenance(id);
      fetchMaintenances();
      setSnackbar({
        open: true,
        message: 'Manutenção deletada com sucesso!',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : 'Erro ao deletar manutenção',
        severity: 'error'
      });
    }
  };

  const filteredMaintenances = maintenances.filter(maintenance =>
    maintenance.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (maintenance.asset_name && maintenance.asset_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const paginatedMaintenances = filteredMaintenances.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Manutenções</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => {
            setEditingMaintenance(null); 
            setOpenModal(true);
          }}
        >
          Nova Manutenção
        </Button>
      </Box>

      <Tabs 
        value={tabValue} 
        onChange={(_, newValue) => setTabValue(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab label="Histórico" />
        <Tab label="Agendamentos" />
      </Tabs>

      {tabValue === 0 && (
        <>
          <TextField
            label="Buscar manutenções"
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
                  <TableCell>Data</TableCell>
                  <TableCell>Custo</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedMaintenances.map((maintenance) => (
                  <TableRow key={maintenance.id}>
                    <TableCell>
                      <Link to={`/assets/${maintenance.asset_id}`} style={{ textDecoration: 'none' }}>
                        {maintenance.asset_name}
                      </Link>
                    </TableCell>
                    <TableCell>{maintenance.service_name}</TableCell>
                    <TableCell>
                      {new Date(maintenance.service_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                        R$ {(Number(maintenance.cost) || 0).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(maintenance)}>
                        <Edit color="primary" />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(maintenance.id)}>
                        <Delete color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredMaintenances.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </>
      )}

      {tabValue === 1 && (
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Agendamentos de Manutenção
          </Typography>
          {schedules.length === 0 ? (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography color="textSecondary">
                Nenhum agendamento encontrado
              </Typography>
              <Button 
                variant="contained"
                sx={{ mt: 2 }}
                onClick={() => navigate('/maintenance-schedules')}
              >
                Gerenciar Agendamentos
              </Button>
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Ativo</TableCell>
                    <TableCell>Serviço</TableCell>
                    <TableCell>Próxima Manutenção</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {schedules.slice(0, 5).map((schedule: MaintenanceSchedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell>Ativo #{schedule.asset_id} - {schedule.asset_name}</TableCell>
                      <TableCell>{schedule.service_name}</TableCell>
                      <TableCell>
                        {schedule.due_date ? new Date(schedule.due_date).toLocaleDateString() : schedule.due_condition}
                      </TableCell>
                      <TableCell>
                        {schedule.is_completed ? 'Concluído' : 'Pendente'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}

      <MaintenanceFormModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditingMaintenance(null); 
        }}
        onSubmit={handleSubmitMaintenance}
        initialData={editingMaintenance || undefined}
        isEditing={!!editingMaintenance}
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
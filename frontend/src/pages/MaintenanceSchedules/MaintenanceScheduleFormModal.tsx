import { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Stack, MenuItem, FormControlLabel, Checkbox } from '@mui/material';
import { AssetService } from '../../services/asset.service';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 1
};

interface MaintenanceScheduleFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    asset_id: number;
    service_name: string;
    due_date?: string | null;
    due_condition?: string | null;
    is_completed?: boolean;
  }) => void;
  initialData?: {
    asset_id: number;
    service_name: string;
    due_date?: string | null;
    due_condition?: string | null;
    is_completed?: boolean;
  };
  isEditing?: boolean;
}

export default function MaintenanceScheduleFormModal({
  open,
  onClose,
  onSubmit,
  initialData,
  isEditing = false
}: MaintenanceScheduleFormModalProps) {
  const [assets, setAssets] = useState<{ id: number, name: string }[]>([]);
  const [assetId, setAssetId] = useState<number>(0);
  const [serviceName, setServiceName] = useState('');
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [dueCondition, setDueCondition] = useState<string | null>(null);
  const [useDate, setUseDate] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const data = await AssetService.getAllAssets();
        setAssets(data.map(asset => ({ id: asset.id, name: asset.name })));
      } catch (err) {
        console.error('Erro ao carregar ativos:', err);
      }
    };
    fetchAssets();
  }, []);

  useEffect(() => {
    if (open) {
      if (initialData) { 
        setAssetId(initialData.asset_id);
        setServiceName(initialData.service_name);
        setDueDate(initialData.due_date || null);
        setDueCondition(initialData.due_condition || null);
        setUseDate(!!initialData.due_date);
      } else { 
        setAssetId(0); 
        setServiceName('');
        setDueDate(null);
        setDueCondition(null);
        setUseDate(true);
      }
    }
  }, [open, initialData]);

  const handleSubmit = () => {
    if (assetId === 0) { 
      console.error("Por favor, selecione um ativo.");
      return;
    }

    onSubmit({
      asset_id: assetId,
      service_name: serviceName,
      due_date: useDate ? dueDate || undefined : null,
      due_condition: !useDate ? dueCondition || undefined : null,
    });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" gutterBottom>
          {isEditing ? 'Editar Agendamento' : 'Novo Agendamento'}
        </Typography>
        <Stack spacing={3}>
          <TextField
            select
            label="Ativo"
            value={assetId}
            onChange={(e) => setAssetId(Number(e.target.value))}
            fullWidth
            required
            error={assetId === 0}
          >
            <MenuItem value={0} disabled>
              Selecione um ativo
            </MenuItem>
            {assets.map((asset) => (
              <MenuItem key={asset.id} value={asset.id}>
                {asset.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Serviço a ser realizado"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            fullWidth
            required
          />

          <FormControlLabel
            control={
              <Checkbox 
                checked={useDate} 
                onChange={(e) => setUseDate(e.target.checked)} 
              />
            }
            label="Usar data específica"
          />

          {useDate ? (
            <TextField
              label="Data prevista"
              type="date"
              value={dueDate || ''}
              onChange={(e) => setDueDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            />
          ) : (
            <TextField
              label="Condição para próxima manutenção"
              value={dueCondition || ''}
              onChange={(e) => setDueCondition(e.target.value)}
              fullWidth
              placeholder="Ex: 10.000 km, 6 meses, etc."
            />
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={onClose}>Cancelar</Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={assetId === 0 || !serviceName || (!useDate && !dueCondition)}
            >
              {isEditing ? 'Atualizar' : 'Salvar'}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
}
import { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Stack, MenuItem, InputAdornment } from '@mui/material';
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

interface MaintenanceFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    asset_id: number;
    service_name: string;
    service_date: string;
    description: string;
    cost: number;
  }) => void;
  initialData?: {
    asset_id: number;
    asset_name?: string;
    service_name: string;
    service_date: string;
    description: string;
    cost: number;
  };
  isEditing?: boolean;
}

export default function MaintenanceFormModal({
  open,
  onClose,
  onSubmit,
  initialData,
  isEditing = false
}: MaintenanceFormModalProps) {
  const [assets, setAssets] = useState<{ id: number, name: string }[]>([]);
  const [assetId, setAssetId] = useState<number>(0);
  const [serviceName, setServiceName] = useState('');
  const [serviceDate, setServiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('0');

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
        setServiceDate(initialData.service_date);
        setDescription(initialData.description);
        setCost(initialData.cost.toString());
      } else { 
        setAssetId(0); 
        setServiceName('');
        setServiceDate(new Date().toISOString().split('T')[0]);
        setDescription('');
        setCost('0');
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
      service_date: serviceDate,
      description,
      cost: parseFloat(cost) || 0
    });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" gutterBottom>
          {isEditing ? 'Editar Manutenção' : 'Nova Manutenção'}
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
            label="Serviço realizado"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Data do serviço"
            type="date"
            value={serviceDate}
            onChange={(e) => setServiceDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            required
          />

          <TextField
            label="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
          />

          <TextField
            label="Custo"
            value={cost}
            onChange={(e) => setCost(e.target.value.replace(/[^0-9.]/g, ''))}
            InputProps={{
              startAdornment: <InputAdornment position="start">R$</InputAdornment>,
            }}
            fullWidth
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={onClose}>Cancelar</Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={assetId === 0 || !serviceName || !serviceDate}
            >
              {isEditing ? 'Atualizar' : 'Salvar'}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
}
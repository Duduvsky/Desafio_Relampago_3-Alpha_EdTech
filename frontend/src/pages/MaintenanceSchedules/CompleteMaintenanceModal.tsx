import { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Stack, InputAdornment } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 1
};

interface CompleteMaintenanceModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (cost: number) => Promise<void>;
}

export default function CompleteMaintenanceModal({
  open,
  onClose,
  onConfirm
}: CompleteMaintenanceModalProps) {
  const [cost, setCost] = useState<string>('0');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm(parseFloat(cost) || 0);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" gutterBottom>
          Informe o custo da manutenção
        </Typography>
        <Stack spacing={3}>
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
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Confirmar'}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
}
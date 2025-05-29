import { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Stack } from '@mui/material';

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

interface AssetFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string }) => void;
  initialData?: { name: string; description: string };
  isEditing?: boolean;
}

export default function AssetFormModal({
  open,
  onClose,
  onSubmit,
  initialData,
  isEditing = false
}: AssetFormModalProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');

  useEffect(() => {
    if (open) {
      setName(initialData?.name || '');
      setDescription(initialData?.description || '');
    }
  }, [open, initialData]);

  const handleSubmit = () => {
    onSubmit({ name, description });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" gutterBottom>
          {isEditing ? 'Editar Ativo' : 'Novo Ativo'}
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={onClose}>Cancelar</Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!name}
            >
              {isEditing ? 'Atualizar' : 'Salvar'}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
}
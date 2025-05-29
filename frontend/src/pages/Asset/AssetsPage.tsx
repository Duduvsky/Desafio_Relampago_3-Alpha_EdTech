import { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, CircularProgress, Alert, TextField, InputAdornment, IconButton, TablePagination, Snackbar } from '@mui/material';
import { Add, Search, Edit, Delete } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { AssetService } from '../../services/asset.service';
import { type AssetPublic } from '../../interfaces/asset';
import AssetFormModal from './AssetFormModal';

export default function AssetsPage() {
  const [assets, setAssets] = useState<AssetPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState<AssetPublic | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const data = await AssetService.getAllAssets();
      setAssets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar ativos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleSubmitAsset = async (assetData: { name: string; description: string }) => {
    try {
      if (editingAsset) {
        await AssetService.updateAsset(editingAsset.id, assetData);
        setSnackbar({
          open: true,
          message: 'Ativo atualizado com sucesso!',
          severity: 'success'
        });
      } else {
        await AssetService.createAsset(assetData);
        setSnackbar({
          open: true,
          message: 'Ativo criado com sucesso!',
          severity: 'success'
        });
      }
      fetchAssets();
      setOpenModal(false);
      setEditingAsset(null);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : 'Erro ao salvar ativo',
        severity: 'error'
      });
    }
  };

  const handleEdit = (asset: AssetPublic) => {
    setEditingAsset(asset);
    setOpenModal(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await AssetService.deleteAsset(id);
      fetchAssets();
      setSnackbar({
        open: true,
        message: 'Ativo deletado com sucesso!',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : 'Erro ao deletar ativo',
        severity: 'error'
      });
    }
  };

  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedAssets = filteredAssets.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Ativos</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => setOpenModal(true)}
        >
          Adicionar Ativo
        </Button>
      </Box>

      <TextField
        label="Buscar ativos"
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
              <TableCell>Nome</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Data de Criação</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedAssets.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell>{asset.name}</TableCell>
                <TableCell>{asset.description}</TableCell>
                <TableCell>
                  {new Date(asset.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(asset)}>
                    <Edit color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(asset.id)}>
                    <Delete color="error" />
                  </IconButton>
                  <Link to={`/assets/${asset.id}`} style={{ textDecoration: 'none' }}>
                    <Button variant="outlined" size="small" sx={{ ml: 1 }}>
                      Detalhes
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredAssets.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />

      <AssetFormModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditingAsset(null);
        }}
        onSubmit={handleSubmitAsset}
        initialData={editingAsset || undefined}
        isEditing={!!editingAsset}
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
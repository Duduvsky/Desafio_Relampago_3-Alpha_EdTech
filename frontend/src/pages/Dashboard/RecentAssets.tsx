import { Card, CardContent, Typography, Table, TableBody, TableCell, TableHead, TableRow, Link, CircularProgress } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useDashboardData } from '../../hooks/useDashboardData';
// import { DashboardData } from '../types/dashboard';

export default function RecentAssets() {
  const { data, loading, error } = useDashboardData();

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Ativos Recentes
        </Typography>
        
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Última Manutenção</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.assets.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell>
                  <Link component={RouterLink} to={`/assets/${asset.id}`}>
                    {asset.name}
                  </Link>
                </TableCell>
                <TableCell>{asset.description}</TableCell>
                <TableCell>
                  {asset.last_maintenance || 'Nenhuma'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
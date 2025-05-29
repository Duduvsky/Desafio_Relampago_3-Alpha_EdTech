import { Grid } from '@mui/material';
import MaintenanceOverview from './MaintenanceOverview';
import RecentAssets from './RecentAssets';
import UpcomingMaintenance from './UpcomingMaintenance';

export default function Dashboard() {
  return (
    <Grid container spacing={3}>
      <Grid>
        <MaintenanceOverview />
      </Grid>
      <Grid >
        <UpcomingMaintenance />
      </Grid>
      <Grid >
        <RecentAssets />
      </Grid>
    </Grid>
  );
}
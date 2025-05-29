import { useEffect, useState } from 'react';
import { AssetService } from '../services/asset.service';
import { MaintenanceLogService } from '../services/maintenanceLog.service';
import { MaintenanceService } from '../services/maintenance.service';
import { type DashboardData } from '../types/dashboard';

export const useDashboardData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData>({
    assets: [],
    maintenanceStats: {
      totalAssets: 0,
      pendingMaintenance: 0,
      overdueMaintenance: 0,
      completedMaintenance: 0
    },
    upcomingMaintenance: [],
    recentActivities: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [assets, pendingSchedules, recentLogs] = await Promise.all([
          AssetService.getAllAssets(),
          MaintenanceService.getPendingSchedules(),
          MaintenanceLogService.getAllLogs(5, 'created_at', 'desc') // Chamada ajustada
        ]);

        const overdueMaintenance = pendingSchedules.filter(
          schedule => schedule.due_date && new Date(schedule.due_date) < new Date()
        ).length;

        setData({
          assets: assets.slice(0, 5),
          maintenanceStats: {
            totalAssets: assets.length,
            pendingMaintenance: pendingSchedules.length,
            overdueMaintenance,
            completedMaintenance: recentLogs.length
          },
          upcomingMaintenance: pendingSchedules.map(schedule => ({
            ...schedule,
            due_date: schedule.due_date ?? null
          })),
          recentActivities: recentLogs.map(log => ({
            id: log.id,
            text: `${log.service_name} realizado em Ativo #${log.asset_id}`,
            time: new Date(log.service_date).toLocaleDateString()
          }))
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};
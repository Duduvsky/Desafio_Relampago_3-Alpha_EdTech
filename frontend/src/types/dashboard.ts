// types/dashboard.ts
export interface MaintenanceItem {
  id: number;
  asset_id: number;
  asset_name?: string; // Adicionaremos isso depois
  service_name: string;
  due_date: string | null;
  created_at: string;
}

export interface AssetItem {
  id: number;
  name: string;
  description: string;
  created_at: string;
  last_maintenance?: string | null;
}

export interface ActivityItem {
  id: number;
  text: string;
  time: string;
}

export interface DashboardData {
  assets: AssetItem[];
  maintenanceStats: {
    totalAssets: number;
    pendingMaintenance: number;
    overdueMaintenance: number;
    completedMaintenance: number;
  };
  upcomingMaintenance: MaintenanceItem[];
  recentActivities: ActivityItem[];
}
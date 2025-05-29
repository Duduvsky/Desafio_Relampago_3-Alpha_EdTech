export interface Asset {
  id: number;
  user_id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at?: string;
}

export interface AssetPublic {
  id: number;
  name: string;
  description: string;
  created_at: string;
  last_maintenance?: string | null;
}

export interface AssetCreateData {
  name: string;
  description: string;
}

export interface AssetUpdateData {
  name?: string;
  description?: string;
}

export interface AssetWithMaintenance {
  id: number;
  name: string;
  description: string;
  created_at: string;
  maintenanceLogs: MaintenanceLogPublic[];
  maintenanceSchedules: MaintenanceSchedulePublic[];
  statistics: {
    totalMaintenance: number;
    completedMaintenance: number;
    pendingMaintenance: number;
    totalCost: number;
  };
}

// Adicione estas interfaces se ainda não existirem
export interface MaintenanceLogPublic {
  id: number;
  service_name: string;
  service_date: string;
  description?: string;
  cost?: number;
}

export interface MaintenanceSchedulePublic {
  id: number;
  service_name: string;
  due_date?: string;
  due_condition?: string;
  is_completed: boolean;
}
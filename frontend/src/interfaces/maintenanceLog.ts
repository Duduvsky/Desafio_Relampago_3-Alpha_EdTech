export interface MaintenanceLog {
  id: number;
  asset_id: number;
  asset_name: string;
  service_name: string;
  service_date: string;
  description: string;
  cost: number;
  created_at: string;
  updated_at?: string;
}

export interface MaintenanceLogPublic {
  id: number;
  asset_id: number;
  service_name: string;
  service_date: string;
  description: string;
  cost: number;
  created_at: string;
}

export interface MaintenanceLogCreateData {
  asset_id: number;
  service_name: string;
  service_date: string;
  description: string;
  cost: number;
}

export interface MaintenanceLogUpdateData {
  service_name?: string;
  service_date?: string;
  description?: string;
  cost?: number;
}
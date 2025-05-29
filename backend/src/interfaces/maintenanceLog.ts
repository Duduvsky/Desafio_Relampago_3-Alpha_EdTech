export interface MaintenanceLog {
  id: number;
  asset_id: number;
  asset_name: string; // Add this line
  service_name: string;
  service_date: Date;
  description?: string;
  cost?: number;
  created_at: Date;
  updated_at: Date;
}

export interface MaintenanceLogPublic {
  id: number;
  asset_id: number;
  asset_name: string; // Add this line
  service_name: string;
  service_date: Date;
  description?: string;
  cost?: number;
  created_at: Date;
}

export interface MaintenanceLogCreateData {
  asset_id: number;
  service_name: string;
  service_date: string; // ISO string
  description?: string;
  cost?: number;
}

export interface MaintenanceLogUpdateData {
  asset_id?: number; // Keep this one for allowing assetId edits
  service_name?: string;
  service_date?: string; // ISO string
  description?: string;
  cost?: number;
}
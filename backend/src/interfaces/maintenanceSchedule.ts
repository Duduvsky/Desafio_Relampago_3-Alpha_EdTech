export interface MaintenanceSchedule {
  id: number;
  asset_id: number;
  log_id?: number | null;
  service_name: string;
  due_date?: Date | null;
  due_condition?: string | null;
  is_completed: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface MaintenanceSchedulePublic {
  id: number;
  asset_id: number;
  log_id?: number | null;
  service_name: string;
  due_date?: Date | null;
  due_condition?: string | null;
  is_completed: boolean;
  created_at: Date;
}

export interface MaintenanceScheduleCreateData {
  asset_id: number;
  service_name: string;
  log_id: number;
  due_date?: string | null; // ISO string
  due_condition?: string | null;
  is_completed?: boolean;
}

export interface MaintenanceScheduleUpdateData {
  service_name?: string;
  due_date?: string | null; // ISO string
  due_condition?: string | null;
  is_completed?: boolean;
  log_id?: number | null;
}
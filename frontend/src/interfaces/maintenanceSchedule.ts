export interface MaintenanceSchedule {
  id: number;
  asset_id: number;
  asset_name: string;
  log_id?: number | null;
  service_name: string;
  due_date?: string | null;
  due_condition?: string | null;
  is_completed: boolean;
  cost?: number;
  created_at: string;
  updated_at?: string;
}

export interface MaintenanceSchedulePublic {
  id: number;
  asset_id: number;
  log_id?: number | null;
  service_name: string;
  due_date?: string | null;
  due_condition?: string | null;
  is_completed: boolean;
  created_at: string;
}

export interface MaintenanceScheduleCreateData {
  asset_id: number;
  log_id?: number;
  service_name: string;
  due_date?: string;
  due_condition?: string;
  is_completed?: boolean;
}

export interface MaintenanceScheduleUpdateData {
  service_name?: string;
  due_date?: string | null;
  due_condition?: string | null;
  is_completed?: boolean;
  log_id?: number | null;
}

export interface MaintenanceScheduleFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: MaintenanceSchedule | {
    asset_id: number;
    service_name: string;
    due_date?: string | null;
    due_condition?: string | null;
    is_completed?: boolean;
  }) => Promise<void>;
  initialData?: MaintenanceSchedule;
  isEditing: boolean;
}
import api from '../config/api';
import { type MaintenanceLog, type MaintenanceLogCreateData, type MaintenanceLogUpdateData  } from '../interfaces/maintenanceLog';
import { type MaintenanceSchedulePublic } from '../interfaces/maintenanceSchedule';

export const MaintenanceService = {
  async getAllMaintenances(): Promise<MaintenanceLog[]> {
    const response = await api.get<MaintenanceLog[]>('/maintenance-logs');
    return response.data;
  },

  async createMaintenance(data: MaintenanceLogCreateData): Promise<MaintenanceLog> {
    const response = await api.post<MaintenanceLog>('/maintenance-logs', data);
    return response.data;
  },

  async updateMaintenance(
    id: number,
    data: MaintenanceLogUpdateData
  ): Promise<MaintenanceLog> {
    const response = await api.put<MaintenanceLog>(`/maintenance-logs/${id}`, data);
    return response.data;
  },

  async deleteMaintenance(id: number): Promise<void> {
    await api.delete(`/maintenance-logs/${id}`);
  },

  // Método adicional para buscar por ativo
  async getMaintenancesByAsset(assetId: number): Promise<MaintenanceLog[]> {
    const response = await api.get<MaintenanceLog[]>(`/maintenance-logs/asset/${assetId}`);
    return response.data;
  },

  // Método adicional para buscar um registro específico
  async getMaintenanceById(id: number): Promise<MaintenanceLog> {
    const response = await api.get<MaintenanceLog>(`/maintenance-logs/${id}`);
    return response.data;
  },

  async getPendingSchedules(): Promise<MaintenanceSchedulePublic[]> {
    const response = await api.get<MaintenanceSchedulePublic[]>('/maintenance-schedules/pending');
    return response.data;
  }
};
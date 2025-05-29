import { type MaintenanceSchedule, type MaintenanceScheduleCreateData, 
    type MaintenanceScheduleUpdateData } from '../interfaces/maintenanceSchedule';
import api from '../config/api';

export const MaintenanceScheduleService = {
  async createSchedule(data: MaintenanceScheduleCreateData): Promise<MaintenanceSchedule> {
    const response = await api.post('/maintenance-schedules', data);
    return response.data;
  },

  async updateSchedule(id: number, data: MaintenanceScheduleUpdateData): Promise<MaintenanceSchedule> {
    const response = await api.put(`/maintenance-schedules/${id}`, data);
    return response.data;
  },

  async deleteSchedule(id: number): Promise<void> {
    await api.delete(`/maintenance-schedules/${id}`);
  },

  async markAsCompleted(id: number, logId: number): Promise<MaintenanceSchedule> {
    const response = await api.patch(`/maintenance-schedules/${id}/complete`, {
      log_id: logId
    });
    return response.data;
  },

  // async getAllSchedules(includeCompleted: boolean = false): Promise<MaintenanceSchedule[]> {
  //   const response = await api.get('/maintenance-schedules', {
  //     params: { includeCompleted }
  //   });
  //   return response.data;
  // },

  async getAllSchedules(): Promise<MaintenanceSchedule[]> {
    const response = await api.get('/maintenance-schedules', {
      params: { includeCompleted: true, includeAsset: true } // Adicione este parâmetro
    });
    return response.data;
  },

  async getPendingSchedules(): Promise<MaintenanceSchedule[]> {
    const response = await api.get('/maintenance-schedules/pending');
    return response.data;
  },
}
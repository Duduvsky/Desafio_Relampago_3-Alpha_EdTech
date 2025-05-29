import api from '../config/api';
import { 
  type MaintenanceLogPublic, 
  type MaintenanceLogCreateData, 
  type MaintenanceLogUpdateData 
} from '../interfaces/maintenanceLog';

export const MaintenanceLogService = {
  async getRecentLogs(limit: number = 5): Promise<MaintenanceLogPublic[]> {
    const response = await api.get<MaintenanceLogPublic[]>(
      `/maintenance-logs?_limit=${limit}&_sort=created_at&_order=desc`
    );
    return response.data;
  },

  async getLogsByAsset(assetId: number): Promise<MaintenanceLogPublic[]> {
    const response = await api.get<MaintenanceLogPublic[]>(
      `/maintenance-logs/asset/${assetId}`
    );
    return response.data;
  },

  async createLog(logData: MaintenanceLogCreateData): Promise<MaintenanceLogPublic> {
    const response = await api.post<MaintenanceLogPublic>(
      '/maintenance-logs',
      logData
    );
    return response.data;
  },

  async updateLog(
    logId: number,
    updateData: MaintenanceLogUpdateData
  ): Promise<MaintenanceLogPublic> {
    const response = await api.put<MaintenanceLogPublic>(
      `/maintenance-logs/${logId}`,
      updateData
    );
    return response.data;
  },

  async deleteLog(logId: number): Promise<void> {
    await api.delete(`/maintenance-logs/${logId}`);
  },

  async getAllLogs(
    limit: number = 5,
    sort: string = 'created_at',
    order: string = 'desc'
  ): Promise<MaintenanceLogPublic[]> {
    const response = await api.get<MaintenanceLogPublic[]>(
      `/maintenance-logs`,
      {
        params: {
          _limit: limit,
          _sort: sort,
          _order: order
        }
      }
    );
    return response.data;
  }
};
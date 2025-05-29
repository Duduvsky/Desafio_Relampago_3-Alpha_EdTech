import api from '../config/api';
import { type AssetPublic, type AssetCreateData, type AssetUpdateData, type AssetWithMaintenance } from '../interfaces/asset';

export const AssetService = {
  async getAllAssets(): Promise<AssetPublic[]> {
    const response = await api.get<AssetPublic[]>('/assets');
    return response.data;
  },

  async getAssetById(assetId: number): Promise<AssetPublic> {
    const response = await api.get<AssetPublic>(`/assets/${assetId}`);
    return response.data;
  },

  async createAsset(assetData: AssetCreateData): Promise<AssetPublic> {
    const response = await api.post<AssetPublic>('/assets', assetData);
    return response.data;
  },

  async updateAsset(
    assetId: number,
    updateData: AssetUpdateData
  ): Promise<AssetPublic> {
    const response = await api.put<AssetPublic>(`/assets/${assetId}`, updateData);
    return response.data;
  },

  async deleteAsset(assetId: number): Promise<void> {
    await api.delete(`/assets/${assetId}`);
  },

  async getAssetWithMaintenance(assetId: number): Promise<AssetWithMaintenance> {
    const response = await api.get<AssetWithMaintenance>(
      `/assets/${assetId}/with-maintenance`
    );
    return response.data;
  }
};
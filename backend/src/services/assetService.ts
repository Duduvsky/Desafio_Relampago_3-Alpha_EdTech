import { query } from '../config/db';
import { Asset, AssetPublic, AssetCreateData, AssetUpdateData } from '../interfaces/asset';

export const AssetService = {
  async createAsset(userId: number, assetData: AssetCreateData): Promise<AssetPublic> {
    const result = await query(
      `INSERT INTO assets (user_id, name, description) 
       VALUES ($1, $2, $3) 
       RETURNING id, name, description, created_at`,
      [userId, assetData.name, assetData.description]
    );

    return result.rows[0];
  },

  async getAllAssets(userId: number): Promise<AssetPublic[]> {
    const result = await query(
      'SELECT id, name, description, created_at FROM assets WHERE user_id = $1',
      [userId]
    );
    return result.rows;
  },

  async getAssetById(userId: number, assetId: number): Promise<AssetPublic> {
    const result = await query(
      'SELECT id, name, description, created_at FROM assets WHERE id = $1 AND user_id = $2',
      [assetId, userId]
    );
    
    if (result.rows.length === 0) {
      throw new Error('Ativo não encontrado ou não pertence ao usuário');
    }

    return result.rows[0];
  },

  async updateAsset(
    userId: number,
    assetId: number,
    updateData: AssetUpdateData
  ): Promise<AssetPublic> {
    const assetExists = await query(
      'SELECT 1 FROM assets WHERE id = $1 AND user_id = $2',
      [assetId, userId]
    );
    
    if (assetExists.rows.length === 0) {
      throw new Error('Ativo não encontrado ou não pertence ao usuário');
    }

    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (updateData.name) {
      fields.push(`name = $${paramIndex}`);
      values.push(updateData.name);
      paramIndex++;
    }

    if (updateData.description) {
      fields.push(`description = $${paramIndex}`);
      values.push(updateData.description);
      paramIndex++;
    }

    if (fields.length === 0) {
      throw new Error('Nenhum dado fornecido para atualização');
    }

    fields.push(`updated_at = NOW()`);
    values.push(assetId); // Para o WHERE
    values.push(userId);  // Para o WHERE

    const queryText = `
      UPDATE assets 
      SET ${fields.join(', ')} 
      WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
      RETURNING id, name, description, created_at
    `;

    const result = await query(queryText, values);
    return result.rows[0];
  },

  async deleteAsset(userId: number, assetId: number): Promise<void> {
    const result = await query(
      'DELETE FROM assets WHERE id = $1 AND user_id = $2',
      [assetId, userId]
    );
    
    if (result.rowCount === 0) {
      throw new Error('Ativo não encontrado ou não pertence ao usuário');
    }
  },

  async getAssetWithMaintenance(userId: number, assetId: number): Promise<any> {
    const assetCheck = await query(
      'SELECT id, name, description, created_at FROM assets WHERE id = $1 AND user_id = $2',
      [assetId, userId]
    );
    
    if (assetCheck.rows.length === 0) {
      throw new Error('Ativo não encontrado ou não pertence ao usuário');
    }

    const asset = assetCheck.rows[0];

    // Busca logs de manutenção
    const maintenanceLogs = await query(
      `SELECT id, service_name, service_date, description, cost 
      FROM maintenance_logs 
      WHERE asset_id = $1 
      ORDER BY service_date DESC`,
      [assetId]
    );

    // Busca agendamentos
    const maintenanceSchedules = await query(
      `SELECT id, service_name, due_date, due_condition, is_completed 
      FROM maintenance_schedules 
      WHERE asset_id = $1 
      ORDER BY is_completed, due_date NULLS LAST`,
      [assetId]
    );

    // Calcula estatísticas separadamente
    const logsStats = await query(
      `SELECT COUNT(id) as total_logs, COALESCE(SUM(cost), 0) as total_cost
      FROM maintenance_logs 
      WHERE asset_id = $1`,
      [assetId]
    );

    const schedulesStats = await query(
      `SELECT 
        COUNT(id) as total_schedules,
        SUM(CASE WHEN is_completed = true THEN 1 ELSE 0 END) as completed_schedules,
        SUM(CASE WHEN is_completed = false THEN 1 ELSE 0 END) as pending_schedules
      FROM maintenance_schedules 
      WHERE asset_id = $1`,
      [assetId]
    );

    return {
      ...asset,
      maintenanceLogs: maintenanceLogs.rows,
      maintenanceSchedules: maintenanceSchedules.rows,
      statistics: {
        totalMaintenance: parseInt(logsStats.rows[0].total_logs) || 0,
        completedMaintenance: parseInt(schedulesStats.rows[0].completed_schedules) || 0,
        pendingMaintenance: parseInt(schedulesStats.rows[0].pending_schedules) || 0,
        totalCost: parseFloat(logsStats.rows[0].total_cost) || 0,
        totalSchedules: parseInt(schedulesStats.rows[0].total_schedules) || 0
      }
    };
  }
};
import { query } from '../config/db';
import { MaintenanceLog, MaintenanceLogPublic, MaintenanceLogCreateData, MaintenanceLogUpdateData } from '../interfaces/maintenanceLog';

export const MaintenanceLogService = {
  async createLog(userId: number, logData: MaintenanceLogCreateData): Promise<MaintenanceLogPublic> {
    const assetCheck = await query(
      'SELECT 1 FROM assets WHERE id = $1 AND user_id = $2',
      [logData.asset_id, userId]
    );
    
    if (assetCheck.rows.length === 0) {
      throw new Error('Ativo não encontrado ou não pertence ao usuário');
    }

    const result = await query(
      `INSERT INTO maintenance_logs 
       (asset_id, service_name, service_date, description, cost) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, asset_id, service_name, service_date, description, cost, created_at`,
      [
        logData.asset_id, 
        logData.service_name, 
        new Date(logData.service_date), 
        logData.description, 
        logData.cost
      ]
    );

    return result.rows[0];
  },

  async getLogsByAsset(userId: number, assetId: number): Promise<MaintenanceLogPublic[]> {
    const assetCheck = await query(
      'SELECT 1 FROM assets WHERE id = $1 AND user_id = $2',
      [assetId, userId]
    );
    
    if (assetCheck.rows.length === 0) {
      throw new Error('Ativo não encontrado ou não pertence ao usuário');
    }

    const result = await query(
      `SELECT ml.id, ml.asset_id, a.name AS asset_name, ml.service_name, ml.service_date, ml.description, ml.cost, ml.created_at 
       FROM maintenance_logs ml
       JOIN assets a ON ml.asset_id = a.id -- Adicionado JOIN para obter o nome do ativo
       WHERE ml.asset_id = $1 AND a.user_id = $2 -- Garantir que o ativo pertence ao usuário
       ORDER BY ml.service_date DESC`,
      [assetId, userId]
    );
    
    return result.rows;
  },

  async getLogById(userId: number, logId: number): Promise<MaintenanceLogPublic> {
    const result = await query(
      `SELECT ml.id, ml.asset_id, a.name AS asset_name, ml.service_name, ml.service_date, 
              ml.description, ml.cost, ml.created_at 
       FROM maintenance_logs ml
       JOIN assets a ON ml.asset_id = a.id -- Adicionado JOIN para obter o nome do ativo
       WHERE ml.id = $1 AND a.user_id = $2`,
      [logId, userId]
    );
    
    if (result.rows.length === 0) {
      throw new Error('Registro de manutenção não encontrado ou não pertence ao usuário');
    }

    return result.rows[0];
  },

  async updateLog( userId: number, logId: number, updateData: MaintenanceLogUpdateData ): Promise<MaintenanceLogPublic> {
    const logExists = await query(
      `SELECT 1 FROM maintenance_logs ml
       JOIN assets a ON ml.asset_id = a.id
       WHERE ml.id = $1 AND a.user_id = $2`,
      [logId, userId]
    );
    
    if (logExists.rows.length === 0) {
      throw new Error('Registro de manutenção não encontrado ou não pertence ao usuário');
    }

    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (updateData.asset_id !== undefined) {
      const assetCheck = await query(
        'SELECT 1 FROM assets WHERE id = $1 AND user_id = $2',
        [updateData.asset_id, userId]
      );
      if (assetCheck.rows.length === 0) {
        throw new Error('Novo ativo não encontrado ou não pertence ao usuário');
      }
      fields.push(`asset_id = $${paramIndex}`);
      values.push(updateData.asset_id);
      paramIndex++;
    }

    if (updateData.service_name) {
      fields.push(`service_name = $${paramIndex}`);
      values.push(updateData.service_name);
      paramIndex++;
    }

    if (updateData.service_date) {
      fields.push(`service_date = $${paramIndex}`);
      values.push(new Date(updateData.service_date));
      paramIndex++;
    }

    if (updateData.description !== undefined) {
      fields.push(`description = $${paramIndex}`);
      values.push(updateData.description);
      paramIndex++;
    }

    if (updateData.cost !== undefined) {
      fields.push(`cost = $${paramIndex}`);
      values.push(updateData.cost);
      paramIndex++;
    }

    if (fields.length === 0) {
      throw new Error('Nenhum dado fornecido para atualização');
    }

    fields.push(`updated_at = NOW()`); 
    values.push(logId); 

    const queryText = `
      UPDATE maintenance_logs 
      SET ${fields.join(', ')} 
      WHERE id = $${paramIndex}
      RETURNING id, asset_id, service_name, service_date, description, cost, created_at, updated_at
    `;

    const result = await query(queryText, values);
    return result.rows[0];
  },

  async deleteLog(userId: number, logId: number): Promise<void> {
    const result = await query(
      `DELETE FROM maintenance_logs ml
       USING assets a
       WHERE ml.id = $1 AND ml.asset_id = a.id AND a.user_id = $2`,
      [logId, userId]
    );
    
    if (result.rowCount === 0) {
      throw new Error('Registro de manutenção não encontrado ou não pertence ao usuário');
    }
  },

  async getRecentLogs(userId: number, limit: number = 5): Promise<MaintenanceLogPublic[]> {
    const result = await query(
      `SELECT ml.id, ml.asset_id, a.name AS asset_name, ml.service_name, ml.service_date, 
              ml.description, ml.cost, ml.created_at 
       FROM maintenance_logs ml
       JOIN assets a ON ml.asset_id = a.id -- Adicionado JOIN para obter o nome do ativo
       WHERE a.user_id = $1
       ORDER BY ml.created_at DESC
       LIMIT $2`,
      [userId, limit]
    );
    
    return result.rows;
  },

  async getAllLogs(
    userId: number,
    limit?: number,
    sort?: string,
    order?: string
  ): Promise<MaintenanceLogPublic[]> {
    let queryText = `
      SELECT ml.id, ml.asset_id, a.name AS asset_name, ml.service_name, ml.service_date, 
             ml.description, ml.cost, ml.created_at 
      FROM maintenance_logs ml
      JOIN assets a ON ml.asset_id = a.id -- Adicionado JOIN para obter o nome do ativo
      WHERE a.user_id = $1
    `;
    
    const params = [userId];
    
    // Ordenação
    if (sort && ['service_date', 'created_at', 'cost'].includes(sort)) {
      queryText += ` ORDER BY ${sort} ${order === 'desc' ? 'DESC' : 'ASC'}`;
    } else {
      queryText += ' ORDER BY created_at DESC';
    }
    
    // Limite
    if (limit) {
      queryText += ' LIMIT $2';
      params.push(limit);
    }
    
    const result = await query(queryText, params);
    return result.rows;
  }
};
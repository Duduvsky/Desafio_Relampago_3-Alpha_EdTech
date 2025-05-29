import { query } from '../config/db';
import { MaintenanceSchedule, MaintenanceSchedulePublic, MaintenanceScheduleCreateData, MaintenanceScheduleUpdateData } from '../interfaces/maintenanceSchedule';

export const MaintenanceScheduleService = {
  async createSchedule( userId: number,  scheduleData: MaintenanceScheduleCreateData ): Promise<MaintenanceSchedulePublic> {
    const assetCheck = await query(
      'SELECT 1 FROM assets WHERE id = $1 AND user_id = $2',
      [scheduleData.asset_id, userId]
    );
    
    if (assetCheck.rows.length === 0) {
      throw new Error('Ativo não encontrado ou não pertence ao usuário');
    }

    // Verifica se log_id é fornecido e pertence ao usuário
    if (scheduleData.log_id) {
      const logCheck = await query(
        `SELECT 1 FROM maintenance_logs ml
         JOIN assets a ON ml.asset_id = a.id
         WHERE ml.id = $1 AND a.user_id = $2`,
        [scheduleData.log_id, userId]
      );
      
      if (logCheck.rows.length === 0) {
        throw new Error('Registro de manutenção não encontrado ou não pertence ao usuário');
      }
    }

    const result = await query(
      `INSERT INTO maintenance_schedules 
       (asset_id, log_id, service_name, due_date, due_condition, is_completed) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, asset_id, log_id, service_name, due_date, due_condition, is_completed, created_at`,
      [
        scheduleData.asset_id,
        scheduleData.log_id || null,
        scheduleData.service_name,
        scheduleData.due_date ? new Date(scheduleData.due_date) : null,
        scheduleData.due_condition || null,
        scheduleData.is_completed || false
      ]
    );

    return result.rows[0];
  },

  async getSchedulesByAsset( userId: number,  assetId: number, includeCompleted: boolean = false ): Promise<MaintenanceSchedulePublic[]> {
    // Verifica se o ativo pertence ao usuário
    const assetCheck = await query(
      'SELECT 1 FROM assets WHERE id = $1 AND user_id = $2',
      [assetId, userId]
    );
    
    if (assetCheck.rows.length === 0) {
      throw new Error('Ativo não encontrado ou não pertence ao usuário');
    }

    let queryText = `
      SELECT id, asset_id, log_id, service_name, due_date, due_condition, is_completed, created_at 
      FROM maintenance_schedules 
      WHERE asset_id = $1
    `;

    const params = [assetId];

    if (!includeCompleted) {
      queryText += ' AND is_completed = false';
    }

    queryText += ' ORDER BY due_date NULLS LAST, created_at DESC';

    const result = await query(queryText, params);
    return result.rows;
  },

  // async getPendingSchedules(userId: number): Promise<MaintenanceSchedulePublic[]> {
  //   const result = await query(
  //     `SELECT ms.id, ms.asset_id, ms.log_id, ms.service_name, 
  //             ms.due_date, ms.due_condition, ms.is_completed, ms.created_at 
  //      FROM maintenance_schedules ms
  //      JOIN assets a ON ms.asset_id = a.id
  //      WHERE a.user_id = $1 AND ms.is_completed = false
  //      ORDER BY ms.due_date NULLS LAST, ms.created_at DESC`,
  //     [userId]
  //   );
    
  //   return result.rows;
  // },
  
  async getPendingSchedules(userId: number): Promise<MaintenanceSchedulePublic[]> {
    const result = await query(
      `SELECT 
        ms.id, 
        ms.asset_id, 
        a.name as asset_name,
        ms.service_name, 
        ms.due_date, 
        ms.due_condition, 
        ms.is_completed
      FROM maintenance_schedules ms
      JOIN assets a ON ms.asset_id = a.id
      WHERE a.user_id = $1 AND ms.is_completed = false
      ORDER BY ms.due_date NULLS LAST`,
      [userId]
    );
    return result.rows;
  },

  async getScheduleById( userId: number,  scheduleId: number ): Promise<MaintenanceSchedulePublic> {
    const result = await query(
      `SELECT ms.id, ms.asset_id, ms.log_id, ms.service_name, 
              ms.due_date, ms.due_condition, ms.is_completed, ms.created_at 
       FROM maintenance_schedules ms
       JOIN assets a ON ms.asset_id = a.id
       WHERE ms.id = $1 AND a.user_id = $2`,
      [scheduleId, userId]
    );
    
    if (result.rows.length === 0) {
      throw new Error('Agendamento não encontrado ou não pertence ao usuário');
    }

    return result.rows[0];
  },

  async updateSchedule( userId: number, scheduleId: number, updateData: MaintenanceScheduleUpdateData ): Promise<MaintenanceSchedulePublic> {
    // Verifica se o agendamento existe e pertence ao usuário
    const scheduleExists = await query(
      `SELECT 1 FROM maintenance_schedules ms
       JOIN assets a ON ms.asset_id = a.id
       WHERE ms.id = $1 AND a.user_id = $2`,
      [scheduleId, userId]
    );
    
    if (scheduleExists.rows.length === 0) {
      throw new Error('Agendamento não encontrado ou não pertence ao usuário');
    }

    // Verifica se log_id é fornecido e pertence ao usuário
    if (updateData.log_id) {
      const logCheck = await query(
        `SELECT 1 FROM maintenance_logs ml
         JOIN assets a ON ml.asset_id = a.id
         WHERE ml.id = $1 AND a.user_id = $2`,
        [updateData.log_id, userId]
      );
      
      if (logCheck.rows.length === 0) {
        throw new Error('Registro de manutenção não encontrado ou não pertence ao usuário');
      }
    }

    // Atualiza campos fornecidos
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (updateData.service_name) {
      fields.push(`service_name = $${paramIndex}`);
      values.push(updateData.service_name);
      paramIndex++;
    }

    if (updateData.due_date !== undefined) {
      fields.push(`due_date = $${paramIndex}`);
      values.push(updateData.due_date ? new Date(updateData.due_date) : null);
      paramIndex++;
    }

    if (updateData.due_condition !== undefined) {
      fields.push(`due_condition = $${paramIndex}`);
      values.push(updateData.due_condition || null);
      paramIndex++;
    }

    if (updateData.is_completed !== undefined) {
      fields.push(`is_completed = $${paramIndex}`);
      values.push(updateData.is_completed);
      paramIndex++;
    }

    if (updateData.log_id !== undefined) {
      fields.push(`log_id = $${paramIndex}`);
      values.push(updateData.log_id || null);
      paramIndex++;
    }

    if (fields.length === 0) {
      throw new Error('Nenhum dado fornecido para atualização');
    }

    fields.push(`updated_at = NOW()`);
    values.push(scheduleId); // Para o WHERE

    const queryText = `
      UPDATE maintenance_schedules 
      SET ${fields.join(', ')} 
      WHERE id = $${paramIndex}
      RETURNING id, asset_id, log_id, service_name, due_date, due_condition, is_completed, created_at
    `;

    const result = await query(queryText, values);
    return result.rows[0];
  },

  async deleteSchedule(userId: number, scheduleId: number): Promise<void> {
    const result = await query(
      `DELETE FROM maintenance_schedules ms
       USING assets a
       WHERE ms.id = $1 AND ms.asset_id = a.id AND a.user_id = $2`,
      [scheduleId, userId]
    );
    
    if (result.rowCount === 0) {
      throw new Error('Agendamento não encontrado ou não pertence ao usuário');
    }
  },

  async completeSchedule( userId: number, scheduleId: number, logId?: number, cost: number = 0 ): Promise<MaintenanceSchedulePublic> {
    // Verifica se o agendamento existe e pertence ao usuário
    const scheduleExists = await query(
      `SELECT 1 FROM maintenance_schedules ms
       JOIN assets a ON ms.asset_id = a.id
       WHERE ms.id = $1 AND a.user_id = $2`,
      [scheduleId, userId]
    );
    
    if (scheduleExists.rows.length === 0) {
      throw new Error('Agendamento não encontrado ou não pertence ao usuário');
    }

    // Verifica se log_id é fornecido e pertence ao usuário
    // if (logId) {
    //   const logCheck = await query(
    //     `SELECT 1 FROM maintenance_logs ml
    //      JOIN assets a ON ml.asset_id = a.id
    //      WHERE ml.id = $1 AND a.user_id = $2`,
    //     [logId, userId]
    //   );
      
    //   if (logCheck.rows.length === 0) {
    //     throw new Error('Registro de manutenção não encontrado ou não pertence ao usuário');
    //   }
    // }

    const result = await query(
      `UPDATE maintenance_schedules 
       SET is_completed = true, log_id = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id, asset_id, log_id, service_name, due_date, due_condition, is_completed, created_at`,
      [logId || null, scheduleId]
    );

    // const result = await query(
    //   `UPDATE maintenance_schedules 
    //   SET is_completed = true, 
    //       log_id = $1, 
    //       cost = $2, 
    //       updated_at = NOW()
    //   WHERE id = $3
    //   RETURNING id, asset_id, log_id, service_name, due_date, due_condition, is_completed, created_at`,
    //   [logId || null, cost, scheduleId]
    // );

    return result.rows[0];
  },

  // async getAllSchedules(userId: number): Promise<MaintenanceSchedulePublic[]> {
  //   const result = await query(
  //     `SELECT ms.id, ms.asset_id, a.name as asset_name, ms.log_id, 
  //             ms.service_name, ms.due_date, ms.due_condition, 
  //             ms.is_completed, ms.created_at 
  //     FROM maintenance_schedules ms
  //     JOIN assets a ON ms.asset_id = a.id
  //     WHERE a.user_id = $1
  //     ORDER BY ms.is_completed, ms.due_date NULLS LAST, ms.created_at DESC`,
  //     [userId]
  //   );
  //   return result.rows;
  // }

  async getAllSchedules(userId: number, includeCompleted: boolean): Promise<MaintenanceSchedulePublic[]> {
    const result = await query(
      `SELECT 
        ms.id, 
        ms.asset_id, 
        a.name as asset_name,
        ms.log_id, 
        ms.service_name, 
        ms.due_date, 
        ms.due_condition, 
        ms.is_completed, 
        ms.created_at 
      FROM maintenance_schedules ms
      JOIN assets a ON ms.asset_id = a.id
      WHERE a.user_id = $1
      ${!includeCompleted ? 'AND ms.is_completed = false' : ''}
      ORDER BY ms.is_completed, ms.due_date NULLS LAST, ms.created_at DESC`,
      [userId]
    );
    return result.rows;
  }
};
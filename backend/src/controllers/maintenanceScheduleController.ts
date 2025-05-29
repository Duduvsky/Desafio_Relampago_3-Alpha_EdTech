import { Request, Response } from 'express';
import { MaintenanceScheduleService } from '../services/maintenanceScheduleService';

export const MaintenanceScheduleController = {
  async create(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { asset_id, service_name, due_date, due_condition, is_completed, log_id } = req.body;
      
      if (!asset_id || !service_name) {
        res.status(400).json({ 
          error: 'asset_id e service_name são obrigatórios' 
        });
      }

      const schedule = await MaintenanceScheduleService.createSchedule(userId, {
        asset_id,
        service_name,
        due_date,
        due_condition,
        is_completed,
        log_id
      });
      
      res.status(201).json(schedule);
    } catch (error: any) {
      if (error.message.includes('não encontrado')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  },

  async getByAsset(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const assetId = parseInt(req.params.assetId);
      const includeCompleted = req.query.includeCompleted === 'true';
      
      if (isNaN(assetId)) {
        res.status(400).json({ error: 'ID do ativo inválido' });
      }

      const schedules = await MaintenanceScheduleService.getSchedulesByAsset(
        userId, 
        assetId,
        includeCompleted
      );
      res.json(schedules);
    } catch (error: any) {
      if (error.message.includes('não encontrado')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro ao buscar agendamentos' });
      }
    }
  },

  async getPending(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const schedules = await MaintenanceScheduleService.getPendingSchedules(userId);
      res.json(schedules);
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao buscar agendamentos pendentes' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const scheduleId = parseInt(req.params.id);
      
      if (isNaN(scheduleId)) {
        res.status(400).json({ error: 'ID inválido' });
      }

      const schedule = await MaintenanceScheduleService.getScheduleById(userId, scheduleId);
      res.json(schedule);
    } catch (error: any) {
      if (error.message.includes('não encontrado')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro ao buscar agendamento' });
      }
    }
  },

  async update(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const scheduleId = parseInt(req.params.id);
      
      if (isNaN(scheduleId)) {
        res.status(400).json({ error: 'ID inválido' });
      }

      const { service_name, due_date, due_condition, is_completed, log_id } = req.body;
      const updateData: any = {};

      if (service_name) updateData.service_name = service_name;
      if (due_date !== undefined) updateData.due_date = due_date;
      if (due_condition !== undefined) updateData.due_condition = due_condition;
      if (is_completed !== undefined) updateData.is_completed = is_completed;
      if (log_id !== undefined) updateData.log_id = log_id;

      if (Object.keys(updateData).length === 0) {
        res.status(400).json({ error: 'Nenhum dado fornecido para atualização' });
      }

      const schedule = await MaintenanceScheduleService.updateSchedule(
        userId, 
        scheduleId, 
        updateData
      );
      res.json(schedule);
    } catch (error: any) {
      if (error.message.includes('não encontrado')) {
        res.status(404).json({ error: error.message });
      } else if (error.message.includes('Nenhum dado fornecido')) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro ao atualizar agendamento' });
      }
    }
  },

  async complete(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const scheduleId = parseInt(req.params.id);
      const { log_id } = req.body;
      
      if (isNaN(scheduleId)) {
        res.status(400).json({ error: 'ID inválido' });
      }

      const schedule = await MaintenanceScheduleService.completeSchedule(
        userId, 
        scheduleId, 
        log_id
      );
      res.json(schedule);
    } catch (error: any) {
      if (error.message.includes('não encontrado')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro ao marcar agendamento como concluído' });
      }
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const scheduleId = parseInt(req.params.id);
      
      if (isNaN(scheduleId)) {
        res.status(400).json({ error: 'ID inválido' });
      }

      await MaintenanceScheduleService.deleteSchedule(userId, scheduleId);
      res.status(204).send();
    } catch (error: any) {
      if (error.message.includes('não encontrado')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro ao deletar agendamento' });
      }
    }
  },

  // async getAll(req: Request, res: Response) {
  //   try {
  //     const userId = (req as any).user.id;
  //     const includeCompleted = req.query.includeCompleted === 'true';
      
  //     const schedules = includeCompleted 
  //       ? await MaintenanceScheduleService.getAllSchedules(userId)
  //       : await MaintenanceScheduleService.getPendingSchedules(userId);
      
  //     res.json(schedules);
  //   } catch (error: any) {
  //     res.status(500).json({ error: 'Erro ao buscar agendamentos' });
  //   }
  // }

  async getAll(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const includeCompleted = req.query.includeCompleted === 'true';
      
      const schedules = await MaintenanceScheduleService.getAllSchedules(userId, includeCompleted);
      res.json(schedules);
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao buscar agendamentos' });
    }
  }
};
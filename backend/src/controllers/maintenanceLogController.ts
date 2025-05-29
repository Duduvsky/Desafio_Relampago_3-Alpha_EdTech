import { Request, Response } from 'express';
import { MaintenanceLogService } from '../services/maintenanceLogService'; 
import { MaintenanceLogUpdateData } from '../interfaces/maintenanceLog';

export const MaintenanceLogController = {
  async create(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { asset_id, service_name, service_date, description, cost } = req.body;
      
      if (!asset_id || !service_name || !service_date) {
        res.status(400).json({ 
          error: 'asset_id, service_name e service_date são obrigatórios' 
        });
      }

      const log = await MaintenanceLogService.createLog(userId, {
        asset_id,
        service_name,
        service_date,
        description,
        cost
      });
      
      res.status(201).json(log);
    } catch (error: any) {
      if (error.message.includes('não encontrado') || error.message.includes('não pertence')) {
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
      
      if (isNaN(assetId)) {
        res.status(400).json({ error: 'ID do ativo inválido' });
      }

      const logs = await MaintenanceLogService.getLogsByAsset(userId, assetId);
      res.json(logs);
    } catch (error: any) {
      if (error.message.includes('não encontrado') || error.message.includes('não pertence')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro ao buscar registros de manutenção' });
      }
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const logId = parseInt(req.params.id);
      
      if (isNaN(logId)) {
        res.status(400).json({ error: 'ID inválido' });
      }

      const log = await MaintenanceLogService.getLogById(userId, logId);
      res.json(log);
    } catch (error: any) {
      if (error.message.includes('não encontrado') || error.message.includes('não pertence')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro ao buscar registro de manutenção' });
      }
    }
  },

  async update(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const logId = parseInt(req.params.id);
      
      if (isNaN(logId)) {
        res.status(400).json({ error: 'ID inválido' });
      }

      const { asset_id, service_name, service_date, description, cost } = req.body;
      const updateData: MaintenanceLogUpdateData = {}; 

      if (asset_id !== undefined) updateData.asset_id = asset_id;
      if (service_name) updateData.service_name = service_name;
      if (service_date) updateData.service_date = service_date;
      if (description !== undefined) updateData.description = description;
      if (cost !== undefined) updateData.cost = cost;

      if (Object.keys(updateData).length === 0) {
        res.status(400).json({ error: 'Nenhum dado fornecido para atualização' });
      }

      const log = await MaintenanceLogService.updateLog(userId, logId, updateData);
      res.json(log);
    } catch (error: any) {
      if (error.message.includes('não encontrado') || error.message.includes('não pertence')) {
        res.status(404).json({ error: error.message });
      } else if (error.message.includes('Nenhum dado fornecido')) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro ao atualizar registro de manutenção' });
      }
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const logId = parseInt(req.params.id);
      
      if (isNaN(logId)) {
        res.status(400).json({ error: 'ID inválido' });
      }

      await MaintenanceLogService.deleteLog(userId, logId);
      res.status(204).send(); // No Content
    } catch (error: any) {
      if (error.message.includes('não encontrado') || error.message.includes('não pertence')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro ao deletar registro de manutenção' });
      }
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { _limit, _sort, _order } = req.query;
      
      const logs = await MaintenanceLogService.getAllLogs(
        userId,
        _limit ? parseInt(_limit as string) : undefined,
        _sort as string,
        _order as string
      );
      
      res.json(logs);
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao buscar registros de manutenção' });
    }
  },
};

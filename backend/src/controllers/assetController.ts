import { Request, Response } from 'express';
import { AssetService } from '../services/assetService';

export const AssetController = {
  async create(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { name, description } = req.body;
      
      if (!name) {
        res.status(400).json({ error: 'Nome do ativo é obrigatório' });
      }

      const asset = await AssetService.createAsset(userId, { name, description });
      res.status(201).json(asset);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const assets = await AssetService.getAllAssets(userId);
      res.json(assets);
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao buscar ativos' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const assetId = parseInt(req.params.id);
      
      if (isNaN(assetId)) {
        res.status(400).json({ error: 'ID inválido' });
      }

      const asset = await AssetService.getAssetById(userId, assetId);
      res.json(asset);
    } catch (error: any) {
      if (error.message.includes('não encontrado')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro ao buscar ativo' });
      }
    }
  },

  async update(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const assetId = parseInt(req.params.id);
      
      if (isNaN(assetId)) {
        res.status(400).json({ error: 'ID inválido' });
      }

      const { name, description } = req.body;
      const updateData: any = {};

      if (name) updateData.name = name;
      if (description) updateData.description = description;

      if (Object.keys(updateData).length === 0) {
        res.status(400).json({ error: 'Nenhum dado fornecido para atualização' });
      }

      const asset = await AssetService.updateAsset(userId, assetId, updateData);
      res.json(asset);
    } catch (error: any) {
      if (error.message.includes('não encontrado')) {
        res.status(404).json({ error: error.message });
      } else if (error.message.includes('Nenhum dado fornecido')) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro ao atualizar ativo' });
      }
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const assetId = parseInt(req.params.id);
      
      if (isNaN(assetId)) {
        res.status(400).json({ error: 'ID inválido' });
      }

      await AssetService.deleteAsset(userId, assetId);
      res.status(204).send();
    } catch (error: any) {
      if (error.message.includes('não encontrado')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro ao deletar ativo' });
      }
    }
  },

  async getWithMaintenance(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const assetId = parseInt(req.params.id);
      
      if (isNaN(assetId)) {
        res.status(400).json({ error: 'ID inválido' });
      }

      const asset = await AssetService.getAssetWithMaintenance(userId, assetId);
      res.json(asset);
    } catch (error: any) {
      if (error.message.includes('não encontrado')) {
        res.status(404).json({ error: error.message });
      } else {
        console.error('Erro ao buscar ativo com manutenções:', error);
        res.status(500).json({ error: 'Erro ao buscar detalhes do ativo' });
      }
    }
  }
};
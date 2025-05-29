import { Request, Response } from 'express';
import { UserService } from '../services/userService';

export const UserController = {
  async create(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;
      
      if (!username || !email || !password) {
        res.status(400).json({ error: 'Username, email e password são obrigatórios' });
      }

      const user = await UserService.createUser({ username, email, password });
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const users = await UserService.getAllUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
      }

      const user = await UserService.getUserById(id);
      res.json(user);
    } catch (error: any) {
      if (error.message === 'Usuário não encontrado') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro ao buscar usuário' });
      }
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
      }

      const { username, email, password } = req.body;
      const updateData: any = {};

      if (username) updateData.username = username;
      if (email) updateData.email = email;
      if (password) updateData.password = password;

      if (Object.keys(updateData).length === 0) {
        res.status(400).json({ error: 'Nenhum dado fornecido para atualização' });
      }

      const user = await UserService.updateUser(id, updateData);
      res.json(user);
    } catch (error: any) {
      if (error.message === 'Usuário não encontrado') {
        res.status(404).json({ error: error.message });
      } else if (
        error.message.includes('já estão em uso') || 
        error.message.includes('Nenhum dado fornecido')
      ) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro ao atualizar usuário' });
      }
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
      }

      await UserService.deleteUser(id);
      res.status(204).send();
    } catch (error: any) {
      if (error.message === 'Usuário não encontrado') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro ao deletar usuário' });
      }
    }
  }
};
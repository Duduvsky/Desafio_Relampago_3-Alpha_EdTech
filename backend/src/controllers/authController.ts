import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

export const AuthController = {
  async login(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;

      if (!password || (!username && !email)) {
        res.status(400).json({ 
          error: 'Forneça username/email e senha'
        });
      }

      const loginId = username || email;
      const { user, token } = await AuthService.login(loginId, password);

      res.cookie('token', token, { 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        maxAge: 60 * 60 * 1000, 
        sameSite: 'lax',
        path: '/'
      });

      res.json({
        user: {
          id: user.id,
          username: user.username, 
          email: user.email
        }
      });
    } catch (error: any) {
      res.status(401).json({
        error: error.message
      });
    }
  },

  async logout(_req: Request, res: Response) {
    try {
      res.clearCookie('token', {
        path: '/'
      });
      res.json({
        success: true
      });
    } catch (error: any) {
      console.error("Erro ao fazer logout:", error);
      res.status(500).json({ 
        error: 'Erro interno do servidor ao fazer logout.'
      });
    }
  },

  async checkToken(req: Request, res: Response) {
    try {
      const token = req.cookies.token;

      if (!token) {
        res.status(401).json({ 
          valid: false,
          message: 'Token não encontrado'
        });
      }

      const result = await AuthService.validateToken(token);
      res.json({ 
        valid: true,
        user: { 
          id: result.user.id,
          username: (result.user as any).username,
          email: (result.user as any).email 
        }
      });
    } catch (error: any) {
      res.status(401).json({ 
        valid: false,
        message: error.message
      });
    }
  }
};
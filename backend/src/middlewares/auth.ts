import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { User } from '../interfaces/user';


export interface AuthRequest extends Request {
  user?: Pick<User, 'id' | 'username' | 'email'>; 
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401).json({ error: 'Não autenticado: Token não fornecido' }); 
    }

    const result = await AuthService.validateToken(token); 
    req.user = result.user; 
    next(); 
  } catch (error: any) {
    res.status(401).json({ error: 'Não autorizado: ' + error.message }); 
  }
};
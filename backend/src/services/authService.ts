import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { query } from '../config/db';
import { JWT_SECRET } from '../config/constants';
import { User } from '../interfaces/user';

export const AuthService = {
  async login(usernameOrEmail: string, password: string) {
    const isEmail = usernameOrEmail.includes('@');
    const queryText = isEmail
      ? 'SELECT * FROM users WHERE email = $1'
      : 'SELECT * FROM users WHERE username = $1';

    const result = await query(queryText, [usernameOrEmail]);
    const user = result.rows[0] as User | undefined;

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      throw new Error('Credenciais inválidas');
    }

    const token = jwt.sign(
      { id: user.id },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token 
    };
  },

  async logout() {
    return { success: true }; 
  },

  async validateToken(token: string) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: number };

      const userResult = await query('SELECT id, username, email FROM users WHERE id = $1', [decoded.id]);
      const user = userResult.rows[0] as Pick<User, 'id' | 'username' | 'email'> | undefined;

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      return { valid: true, user: user };
    } catch (error) {
      throw new Error('Token inválido ou expirado');
    }
  }
};
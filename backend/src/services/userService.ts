import { query } from '../config/db';
import { hashPassword } from '../utils/passwordEncryption';
import { User, UserPublic } from '../interfaces/user';

export const UserService = {
  async createUser(userData: { username: string; email: string; password: string }): Promise<UserPublic> {
    const existingUser = await query(
      'SELECT * FROM users WHERE username = $1 OR email = $2', 
      [userData.username, userData.email]
    );
    
    if (existingUser.rows.length > 0) {
      throw new Error('Username ou email já estão em uso');
    }

    const hashedPassword = await hashPassword(userData.password);
    
    const result = await query(
      `INSERT INTO users (username, email, password_hash) 
       VALUES ($1, $2, $3) 
       RETURNING id, username, email, created_at`,
      [userData.username, userData.email, hashedPassword]
    );

    return result.rows[0];
  },

  async getAllUsers(): Promise<UserPublic[]> {
    const result = await query(
      'SELECT id, username, email, created_at FROM users',
      []
    );
    return result.rows;
  },

  async getUserById(id: number): Promise<UserPublic> {
    const result = await query(
      'SELECT id, username, email, created_at FROM users WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      throw new Error('Usuário não encontrado');
    }

    return result.rows[0];
  },

  async updateUser(
    id: number, 
    updateData: { username?: string; email?: string; password?: string }
  ): Promise<UserPublic> {
    // Verifica se o usuário existe
    const userExists = await query('SELECT 1 FROM users WHERE id = $1', [id]);
    if (userExists.rows.length === 0) {
      throw new Error('Usuário não encontrado');
    }

    // Verifica se novo username/email já existe
    if (updateData.username || updateData.email) {
      const existing = await query(
        'SELECT 1 FROM users WHERE (username = $1 OR email = $2) AND id != $3',
        [updateData.username, updateData.email, id]
      );
      
      if (existing.rows.length > 0) {
        throw new Error('Username ou email já estão em uso');
      }
    }

    // Atualiza campos fornecidos
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (updateData.username) {
      fields.push(`username = $${paramIndex}`);
      values.push(updateData.username);
      paramIndex++;
    }

    if (updateData.email) {
      fields.push(`email = $${paramIndex}`);
      values.push(updateData.email);
      paramIndex++;
    }

    if (updateData.password) {
      const hashedPassword = await hashPassword(updateData.password);
      fields.push(`password_hash = $${paramIndex}`);
      values.push(hashedPassword);
      paramIndex++;
    }

    if (fields.length === 0) {
      throw new Error('Nenhum dado fornecido para atualização');
    }

    fields.push(`updated_at = NOW()`);
    values.push(id); // Para o WHERE

    const queryText = `
      UPDATE users 
      SET ${fields.join(', ')} 
      WHERE id = $${paramIndex}
      RETURNING id, username, email, created_at
    `;

    const result = await query(queryText, values);
    return result.rows[0];
  },

  async deleteUser(id: number): Promise<void> {
    const result = await query('DELETE FROM users WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      throw new Error('Usuário não encontrado');
    }
  }
};
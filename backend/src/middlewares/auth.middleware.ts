import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database';
import { User } from '../models/user.model';

export interface AuthRequest extends Request {
  user?: User;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: '액세스 토큰이 필요합니다.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    
    // 사용자 정보 조회
    const [rows] = await pool.execute<User[]>(
      'SELECT * FROM users WHERE user_id = ? AND is_active = TRUE',
      [decoded.userId]
    );

    if (rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: '유효하지 않은 사용자입니다.' 
      });
    }

    req.user = rows[0];
    next();
  } catch (error) {
    console.error('인증 미들웨어 오류:', error);
    return res.status(403).json({ 
      success: false, 
      message: '토큰이 유효하지 않습니다.' 
    });
  }
};

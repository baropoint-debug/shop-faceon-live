import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database';
import { User, CreateUserData, LoginCredentials } from '../models/user.model';
import { AuthRequest } from '../middlewares/auth.middleware';

// 회원가입
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, nickname, title, introduction }: CreateUserData = req.body;

    // 필수 필드 검증
    if (!email || !password || !nickname) {
      return res.status(400).json({
        success: false,
        message: '이메일, 비밀번호, 닉네임은 필수입니다.'
      });
    }

    // 이메일 중복 확인
    const [existingUsers] = await pool.execute<User[]>(
      'SELECT user_id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: '이미 사용 중인 이메일입니다.'
      });
    }

    // 비밀번호 암호화
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 사용자 생성
    const [result] = await pool.execute(
      `INSERT INTO users (email, password, nickname, title, introduction, ai_introduction_vector, language_code, timezone, utc_offset) 
       VALUES (?, ?, ?, ?, ?, 'waiting', 'ko', 'Asia/Seoul', '+09:00')`,
      [email, hashedPassword, nickname, title || '', introduction || '']
    );

    const insertResult = result as any;
    const userId = insertResult.insertId;

    // JWT 토큰 생성
    const jwtSecret = process.env.JWT_SECRET || 'default-secret';
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
    const token = jwt.sign(
      { userId },
      jwtSecret
    );

    res.status(201).json({
      success: true,
      message: '회원가입이 완료되었습니다.',
      data: {
        token,
        user: {
          user_id: userId,
          email,
          nickname,
          title: title || '',
          introduction: introduction || ''
        }
      }
    });
  } catch (error) {
    console.error('회원가입 오류:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    });
  }
};

// 로그인
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password }: LoginCredentials = req.body;

    // 필수 필드 검증
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: '이메일과 비밀번호를 입력해주세요.'
      });
    }

    // 사용자 조회
    const [users] = await pool.execute<User[]>(
      'SELECT * FROM users WHERE email = ? AND is_active = TRUE',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: '이메일 또는 비밀번호가 올바르지 않습니다.'
      });
    }

    const user = users[0];

    // 비밀번호 확인
    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: '소셜 로그인 계정입니다. 구글 로그인을 이용해주세요.'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '이메일 또는 비밀번호가 올바르지 않습니다.'
      });
    }

    // 로그인 정보 업데이트
    const clientIP = req.ip || req.connection.remoteAddress || '';
    await pool.execute(
      'UPDATE users SET login_ip = ?, login_at = NOW() WHERE user_id = ?',
      [clientIP, user.user_id]
    );

    // JWT 토큰 생성
    const jwtSecret = process.env.JWT_SECRET || 'default-secret';
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
    const token = jwt.sign(
      { userId: user.user_id },
      jwtSecret
    );

    // 비밀번호 제거 후 응답
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: '로그인되었습니다.',
      data: {
        token,
        user: userWithoutPassword
      }
    });
  } catch (error) {
    console.error('로그인 오류:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    });
  }
};

// 프로필 조회
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: {
        user: userWithoutPassword
      }
    });
  } catch (error) {
    console.error('프로필 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    });
  }
};

// 프로필 업데이트
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.user_id;
    const { nickname, title, introduction, icon_url } = req.body;

    const updateFields: string[] = [];
    const values: any[] = [];

    if (nickname !== undefined) {
      updateFields.push('nickname = ?');
      values.push(nickname);
    }
    if (title !== undefined) {
      updateFields.push('title = ?');
      values.push(title);
    }
    if (introduction !== undefined) {
      updateFields.push('introduction = ?');
      values.push(introduction);
    }
    if (icon_url !== undefined) {
      updateFields.push('icon_url = ?');
      values.push(icon_url);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: '업데이트할 정보가 없습니다.'
      });
    }

    values.push(userId);

    await pool.execute(
      `UPDATE users SET ${updateFields.join(', ')}, updated_at = NOW() WHERE user_id = ?`,
      values
    );

    // 업데이트된 사용자 정보 조회
    const [users] = await pool.execute<User[]>(
      'SELECT * FROM users WHERE user_id = ?',
      [userId]
    );

    const { password: _, ...userWithoutPassword } = users[0];

    res.json({
      success: true,
      message: '프로필이 업데이트되었습니다.',
      data: {
        user: userWithoutPassword
      }
    });
  } catch (error) {
    console.error('프로필 업데이트 오류:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    });
  }
};

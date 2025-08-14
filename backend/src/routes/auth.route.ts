import { Router } from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/auth.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// 회원가입
router.post('/register', register);

// 로그인
router.post('/login', login);

// 프로필 조회 (인증 필요)
router.get('/profile', authenticateToken, getProfile);

// 프로필 업데이트 (인증 필요)
router.put('/profile', authenticateToken, updateProfile);

export default router;

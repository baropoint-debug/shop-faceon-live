import app from './app';
import { testConnection } from './config/database';

const PORT = process.env.BACKEND_PORT || 4002;

const startServer = async () => {
  try {
    // 데이터베이스 연결 테스트
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('❌ 데이터베이스 연결에 실패했습니다. 서버를 시작할 수 없습니다.');
      process.exit(1);
    }

    // 서버 시작
    app.listen(PORT, () => {
      console.log('🚀 FaceOn Backend Server Started!');
      console.log(`📍 Server running on: http://localhost:${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 Health Check: http://localhost:${PORT}/health`);
      console.log('='.repeat(50));
    });

  } catch (error) {
    console.error('❌ 서버 시작 중 오류 발생:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});

// 처리되지 않은 예외 처리
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();

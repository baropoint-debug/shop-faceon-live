# Shop Faceon Live

shop.faceon.live 사이트의 소스 코드 저장소입니다.

## 프로젝트 구조

```
shop-www/
├── frontend/          # 프론트엔드 애플리케이션
├── backend/           # 백엔드 API 서버
├── ecosystem.config.js # PM2 설정 파일
└── README.md          # 프로젝트 문서
```

## 기술 스택

- **Frontend**: React/Vue.js (프로젝트에 따라)
- **Backend**: Node.js
- **Process Manager**: PM2
- **Deployment**: Linux Server

## 설치 및 실행

### 백엔드 설정
```bash
cd backend
npm install
npm start
```

### 프론트엔드 설정
```bash
cd frontend
npm install
npm run build
```

### PM2로 실행
```bash
pm2 start ecosystem.config.js
```

## 배포

이 프로젝트는 `/data/www/shop-www` 경로에 배포되어 있으며, PM2를 통해 관리됩니다.

## 라이센스

이 프로젝트는 Faceon Live의 자산입니다.

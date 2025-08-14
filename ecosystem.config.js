module.exports = {
  apps: [
    {
      name: 'shop-backend',
      cwd: '/data/www/shop-www/backend',
      script: 'dist/server.js',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        BACKEND_PORT: 4002
      },
      env_production: {
        NODE_ENV: 'production',
        BACKEND_PORT: 4002
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: '/data/www_logs/shop-backend-error.log',
      out_file: '/data/www_logs/shop-backend-out.log',
      log_file: '/data/www_logs/shop-backend-combined.log',
      time: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '4G',
      node_args: '--max-old-space-size=1024'
    },
    {
      name: 'shop-frontend',
      cwd: '/data/www/shop-www/frontend',
      script: 'npm',
      args: 'start',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3002
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3002
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: '/data/www_logs/shop-frontend-error.log',
      out_file: '/data/www_logs/shop-frontend-out.log',
      log_file: '/data/www_logs/shop-frontend-combined.log',
      time: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '4G',
      node_args: '--max-old-space-size=1024'
    }
  ]
};

module.exports = {
  apps: [
    {
      name: 'course-builder-ai',
      script: 'bun',
      args: 'start',
      cwd: '/home/dev/git/course-builder-ai',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3005,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3005,
      },
      error_file: '/home/dev/.pm2/logs/course-builder-ai-error.log',
      out_file: '/home/dev/.pm2/logs/course-builder-ai-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
  ],
}

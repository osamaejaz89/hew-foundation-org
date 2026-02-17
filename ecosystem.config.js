const path = require("path");

module.exports = {
  apps: [
    {
      name: "hew-foundation-web",
      script: "server.js",
      cwd: path.resolve(__dirname),
      interpreter: "node",

      // Process (server.js serves dist/ — run after npm run build)
      instances: 1,
      exec_mode: "fork",
      watch: false,
      autorestart: true,
      max_restarts: 10,
      min_uptime: "10s",
      restart_delay: 4000,
      kill_timeout: 5000,
      max_memory_restart: "400M",

      // Logs (relative to cwd)
      log_file: "./logs/pm2-combined.log",
      out_file: "./logs/pm2-out.log",
      error_file: "./logs/pm2-error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      time: true,

      // Env
      env: {
        NODE_ENV: "development",
        PORT: 4000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 4000,
      },
    },
  ],
};

module.exports = {
  apps: [{
    name: "hew-foundation",
    script: "server.js",
    cwd: "./",
    instances: 1,
    exec_mode: "fork",
    autorestart: true,
    watch: false,
    max_memory_restart: "1G",
    error_file: "./logs/pm2-error.log",
    out_file: "./logs/pm2-out.log",
    log_file: "./logs/pm2-combined.log",
    time: true,
    merge_logs: true,
    env: {
      NODE_ENV: "production",
      PORT: 4000
    },
    env_development: {
      NODE_ENV: "development",
      PORT: 4000
    },
    // Restart app if it crashes
    min_uptime: "10s",
    max_restarts: 10,
    restart_delay: 4000,
    // Graceful shutdown
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 10000
  }]
} 
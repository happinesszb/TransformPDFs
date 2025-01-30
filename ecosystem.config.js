module.exports = {
  apps: [
    {
      name: "pdf-tools",      // 应用名称
      script: "yarn",         // 使用yarn启动
      args: "start",          // 运行 yarn start
      cwd: "./",             // 项目目录
      env: {
        NODE_ENV: "production",
        PORT: 3002
      },
      exp_backoff_restart_delay: 100,
      user: "www-data"
    }
  ]
} 
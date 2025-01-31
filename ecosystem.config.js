module.exports = {
  apps: [
    {
      name: "pdf-tools",      //  
      script: "yarn",         //  
      args: "start",          //  
      cwd: "./",             //  
      env: {
        NODE_ENV: "production",
        PORT: 3002
      },
      exp_backoff_restart_delay: 100,
      user: "www-data"
    }
  ]
} 
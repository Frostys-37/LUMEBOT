module.exports = {
  apps: [{
    name: "lumebot",
    script: "./src/index.js",
    watch: true,
    ignore_watch: ["node_modules", "logs", "*.log", ".git"]
  }]
};
live
  - start : ../server/node_modules/forever/.bin/forever start --uid "lmonit" --id "lmonit" app.js live
  - logPath : ./logsDevelopment
  
dev start
  - start : ../server/node_modules/forever/.bin/forever start --uid "dmonit" --id "dmonit" app.js dev
  - logPath : ./logsLive
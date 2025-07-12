// utils/logger.js

const { createLogger, format, transports } = require("winston");
require("winston-mongodb"); // enables MongoDB transport

const path = require("path");

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.json()
  ),
  transports: [
    // Save to local file
    new transports.File({
      filename: path.join(__dirname, "../logs/audit.log"),
    }),

    //  Optional: log to console during dev
    new transports.Console(),

    // ✅ Log to MongoDB (optional – ensure DB is running)
    new transports.MongoDB({
      db: "mongodb://localhost:27017/food", 
      options: { useUnifiedTopology: true },
      collection: "audit_logs",
      level: "info",
      tryReconnect: true,
    }),
  ],
});

module.exports = logger;

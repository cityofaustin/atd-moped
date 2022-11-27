const winston = require("winston");

const errorFname = `../logs/error.log`;
const combinedFname = `../logs/combined.log`;

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    // Write all logs with importance level of `error` or less to `error.log`
    new winston.transports.File({
      // this flag causes the file to be overwritten
      options: { flags: "w" },
      filename: errorFname,
      level: "error",
    }),
    // Write all logs with importance level of `info` or less to `combined.log`
    new winston.transports.File({
      // this flag causes the file to be overwritten
      options: { flags: "w" },
      filename: combinedFname,
    }),
  ],
});

logger.add(
  new winston.transports.Console({
    format: winston.format.simple(),
  })
);

exports.logger = logger;

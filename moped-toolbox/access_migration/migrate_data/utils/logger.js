const winston = require("winston");

// uncomment to use a unique file per run

// const errorFname = `../logs/error.log`;
// const combinedFname = `../logs/combined.log`;

const createLogger = (name) => {
  const dateStr = new Date().toISOString().slice(0, 19);
  const errorFname = `../logs/${name}_${dateStr}_error.log`;
  const combinedFname = `../logs/${name}_${dateStr}_combined.log`;

  return winston.createLogger({
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
};

const logger_transform = createLogger("transform");
const logger_load = createLogger("load");

logger_transform.add(
  new winston.transports.Console({
    format: winston.format.simple(),
  })
);

logger_load.add(
  new winston.transports.Console({
    format: winston.format.simple(),
  })
);

exports.logger_transform = logger_transform;
exports.logger_load = logger_load;

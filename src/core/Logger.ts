import { createLogger, transports, format } from 'winston';
import fs from 'fs';
import path from 'path';
import DailyRotateFile from 'winston-daily-rotate-file';
import { environment, logDirectory } from '../config1';

let dir = logDirectory;
if (!dir) dir = path.resolve('logs');

// create directory if it is not present
if (!fs.existsSync(dir)) {
  // Create the directory if it does not exist
  fs.mkdirSync(dir);
}

const logLevel = environment === 'development' ? 'debug' : 'warn';

const dailyRotateFile = new DailyRotateFile({
  level: logLevel,
  // @ts-ignore
  filename: dir + '/%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  handleExceptions: true,
  maxSize: '20m',
  maxFiles: '14d',
  format: format.combine(
    format.errors({ stack: true }),
    format.timestamp(),
    format.json(),
  ),
});
//const logger = createLogger({ format: combine( errors({ stack: true }), // <-- use errors format colorize(), timestamp(), prettyPrint() ), transports: [new transports.Console()], });
//*const logger = winston.createLogger({ transports: [ ... ], format: winston.format.combine(errorStackFormat(), myFormat) })
//*logger.info(new Error('yo')) 
//^const logger = winston.createLogger({ format: winston.format.combine( winston.format.splat(), // Necessary to produce the 'meta' property errorStackTracerFormat(), winston.format.simple() ) });
//^logger.error("Does this work?", new Error("Yup!"));
//^if (info.meta && info.meta instanceof Error) { info.message = `${info.message} ${info.meta.stack}`; } return info; });
//https://stackoverflow.com/questions/47231677/how-to-log-full-stack-trace-with-winston-3
export default createLogger({
  transports: [
    new transports.Console({
      level: logLevel,
      format: format.combine(
        format.errors({ stack: true }),
        format.prettyPrint(),
      ),
    }),
    dailyRotateFile,
  ],
  exceptionHandlers: [dailyRotateFile],
  exitOnError: false, // do not exit on handled exceptions
});

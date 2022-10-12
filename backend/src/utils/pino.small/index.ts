import logger from "pino";
import dayjs from "dayjs";

// This pino logger is used by
// error-handling lib, and (opt) in server.ts.
const log = logger({
  level: 'trace',
  base: {pid: process.pid},
  timestamp: () => `,"time":"${dayjs().format()}"`,
  transport: {
    targets : [

      {target: 'pino-pretty', 
      level: 'trace',
      options: {
          destination: 1  // stdout
        },
      },

      {
        target: 'pino/file', 
        level: 'warn',
        options: {
          // destination log must be handled by system in production
          destination: `./${dayjs().format('YYYY-MM-DD')}-error.log`,
          append: true,
          mkdir: true,
        }, 
      },

    ]
  }
});

export default log;

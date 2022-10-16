import { pino, Logger as PinoLoggerImpl, DestinationStream } from 'pino';
import { LOG_LEVELS, Logger } from './definition';
import dayjs from "dayjs";

export default class PinoLogger implements Logger {
  private readonly logger: PinoLoggerImpl;

  constructor(
    private level: LOG_LEVELS,
    private prettyPrintEnabled: boolean,
    private destStream?: DestinationStream | string
  ) {
    const opts = {
      level: 'debug',
      transport:{
        targets: [
          { target: 'pino-pretty',
            level: 'debug',
            options: {
              colorize: true,
              sync: true,
            },
          },
          { target: 'pino/file', 
            level: 'error',
            options: {
              // destination log must be handled by system in production
              destination: `./${dayjs().format('YYYY-MM-DD')}-error.log`,
              append: true,
              mkdir: true,
            }, 
          },
        ]
      }
    };
    this.logger = pino(opts);
  }

  debug(message: string, ...args: unknown[]): void {
    this.logger.debug(message, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    this.logger.error(message, ...args);
  }

  info(message: string, ...args: unknown[]): void {
    this.logger.info(message, ...args);
  }

  warning(message: string, ...args: unknown[]): void {
    this.logger.warn(message, ...args);
  }
}

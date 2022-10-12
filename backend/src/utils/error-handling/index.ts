import log from '../pino.small';
import * as Http from 'http';
import * as util from 'util';

let httpServerRef: Http.Server;

const errorHandler = {
  // Listen to the global process-level error events
  listenToErrorEvents: (httpServer: Http.Server) => {
    httpServerRef = httpServer;
    process.on('uncaughtException', async (error) => {
      await errorHandler.handleError(error);
    });

    process.on('unhandledRejection', async (reason) => {
      await errorHandler.handleError(reason);
    });

    process.on('SIGTERM', async () => {
      log.error(
        'SIGTERM received, close the server'
      );
      await terminateHttpServerAndExit(0);
    });

    process.on('SIGINT', async () => {
      log.error(
        'SIGINT received, close the server'
      );
      await terminateHttpServerAndExit(0);
    });
  },

  handleError: (errorToHandle: unknown) => {
    try {
      const appError: AppError = normalizeError(errorToHandle);
      log.error(
        `name: ${appError.name}, message: ${appError.message}, HTTPStatus: ${appError.HTTPStatus}, isTrusted: ${appError.isTrusted}, cause: ${appError.cause}, stack:
        ${appError.stack}`
      );
      metricsExporter.fireMetric('error', { errorName: appError.name }); // fire any custom metric when handling error
      // A common best practice is to crash when an unknown error (non-trusted) is being thrown
      if (!appError.isTrusted) {
        terminateHttpServerAndExit(1);
      }
    } catch (handlingError: unknown) {
      // Not using the log here because it might have failed
      process.stdout.write(
        'The error handler failed, here are the handler failure and then the origin error that it tried to handle'
      );
      process.stdout.write(JSON.stringify(handlingError));
      process.stdout.write(JSON.stringify(errorToHandle));
    }
  },
};

const terminateHttpServerAndExit = async (exitCode: number) => {
  // maybe implement more complex logic here (like using 'http-terminator' library)
  if (httpServerRef) {
    await httpServerRef.close();
  }
  process.exit(exitCode);
};

// The input might won't be 'AppError' or even 'Error' instance, the output of this function will be - AppError.
const normalizeError = (errorToHandle: unknown): AppError => {
  if (errorToHandle instanceof AppError) {
    return errorToHandle;
  }
  if (errorToHandle instanceof Error) {
    const appError = new AppError(errorToHandle.name, errorToHandle.message);
    appError.stack = errorToHandle.stack;
    return appError;
  }
  // meaning it could be any type,
  const inputType = typeof errorToHandle;
  return new AppError(
    'general-error',
    `Error Handler received a none error instance with type - ${inputType}, value - ${util.inspect(
      errorToHandle
    )}`
  );
};

class AppError extends Error {
  constructor(
    public name: string,
    public message: string,
    public HTTPStatus: number = 500,
    public isTrusted = true,
    public cause?: unknown
  ) {
    super(message);
  }
}

// This simulates a typical monitoring solution that allow firing custom metrics when
// like Prometheus, DataDog, CloudWatch, etc
const metricsExporter = {
  fireMetric: async (name: string, labels: object) => {
    log.info('Would feed metrics', {
      name,
      labels,
    });
  },
};

export { errorHandler, metricsExporter, AppError };

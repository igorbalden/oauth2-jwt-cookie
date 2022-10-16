import {Server} from 'http';
import {AddressInfo} from 'net';
import { Application } from 'express';
import { createApp } from './app';
import {logger} from './utils/logger';
import { errorHandler} from './utils/error-handling';

let connection: Server;
const app: Application = createApp();
openConnection(app);

export async function openConnection(
  app: Application
): Promise<AddressInfo> {
  return new Promise((resolve, reject) => {
    try {
      connection = app.listen(app.get('port'), '0.0.0.0', () => {
        errorHandler.listenToErrorEvents(connection);
        logger.info(`small - Listening on http://localhost:${app.get('port')}`);
        resolve(connection.address() as AddressInfo);
      })
    } catch(er) {
      reject(er);
    }
  });
}

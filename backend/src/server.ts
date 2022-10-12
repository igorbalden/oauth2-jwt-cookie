import {Server} from 'http';
import {AddressInfo} from 'net';

import './database';
import log from './utils/pino.small';
import { errorHandler} from './utils/error-handling';
import { Application } from 'express';

let connection: Server;
export async function openConnection(
  app: Application
): Promise<AddressInfo> {
  return new Promise((resolve, reject) => {
    try {
      connection = app.listen(app.get('port'), '0.0.0.0', () => {
        errorHandler.listenToErrorEvents(connection);
        log.info(`small - Listening on http://localhost:${app.get('port')}`);
        resolve(connection.address() as AddressInfo);
      })
    } catch(er) {
      reject(er);
    }
  });
}

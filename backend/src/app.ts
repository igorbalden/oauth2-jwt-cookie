import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express'
import passport from 'passport'
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { AppError, errorHandler } from './utils/error-handling';
import {localJwtStrategy, googleStrategy} from './middlewares/passport';
import authRoutes from './routes/auth.routes';
import protectedRoutes from './routes/protected.routes';
import config from './config/config';


export function createApp() {

  const app = express();

  // settings
  app.set('port', config.port || 5000);

  // middlewares
  app.use(morgan('dev'));   // for dev only
  app.use(cookieParser());
  app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Credentials", "true")
    next();
  });

  app.use(
    cors({
      credentials: true,
      origin: true,
      "preflightContinue": true,
    })
  );

  app.use(express.urlencoded({extended: false}));
  app.use(express.json());
  app.use(passport.initialize());
  passport.use(localJwtStrategy);
  passport.use(googleStrategy);

  app.use(authRoutes);
  app.use(protectedRoutes);
  app.get('/', (req, res) => {
    return res.send(`The API is at http://localhost:${app.get('port')}`);
  })

  // Log any unhandled error.
  app.use(async (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    errorHandler.handleError(
      new AppError('error caught', err.message, 500, false, err)
    );
  });

  return app;
}

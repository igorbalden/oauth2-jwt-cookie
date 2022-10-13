import {Request, Response} from 'express'
// jsonwebtoken included in passport-jwt, not in package.json
import jwt from "jsonwebtoken";
import type {JwtPayload} from "jsonwebtoken";

declare module "jsonwebtoken" {
  interface JwtPayload {
    payload: {[key: string]: string},
  }
}

const pause = (n: number)=> {
  return new Promise((resolve, _)=> {
    setTimeout(()=> {
      resolve(true);
    }, n * 1000)
  });
}

export const dashboard = async (req: Request, res: Response) => {
  await pause(1);
  const token = req.cookies['jwt'];
  const decodedToken = jwt.decode(token, { complete: true }) as JwtPayload;
  const dPayload = decodedToken?.payload;
  return res.json({ msg: `Hey ${dPayload?.email}` });
};
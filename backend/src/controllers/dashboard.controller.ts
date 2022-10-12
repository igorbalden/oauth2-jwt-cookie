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
  console.log('1', new Date().toISOString())
  await pause(1);
  console.log('2', new Date().toISOString())
  const token = req.header("authorization")!.split(' ')[1];
  const decodedToken = jwt.decode(token, { complete: true }) as JwtPayload;
  const dPayload = decodedToken?.payload;
  // throw new Error('get a special error');
  return res.json({ msg: `Hey ${dPayload?.email}` });
};
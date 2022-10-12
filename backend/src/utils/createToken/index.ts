import{ IUser } from "../../models/user";
// jsonwebtoken included in passport-jwt, not in package.json
import jwt from "jsonwebtoken";
import config from "../../config/config";

export function createToken(user: IUser) {
  return jwt.sign(
    { id: user.id, email: user.email },
    config.jwtSecret as string,
    {expiresIn: 86400},
  );
}

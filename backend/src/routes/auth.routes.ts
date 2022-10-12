import {Router, Request, Response} from 'express';
import User, {IUser} from '../models/user';
import passport from 'passport';
import {login, signUp,} from '../controllers/user.controller';
import {createToken} from '../utils/createToken';

module express {
  interface Request {
    Guser: Guser;
  }
}
interface Guser {
  id: string;
  emails: {
    value: string;
    verified: boolean;
  }[]
}

const CLIENT_URL = "http://localhost:3000/";

const router = Router();

const pause = (n: number)=> {
  return new Promise((resolve, _)=> {
    setTimeout(()=> {
      resolve(true);
    }, n * 1000)
  });
}

router.post('/signup', signUp);

router.post('/login', login);

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

router.get("/auth/google", passport.authenticate("google", { session: false, scope: ["profile", "email"] }));

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login/failed",
    session: false,
    scope: ["profile", "email"]
  }),
  async (req: Request, res: Response)=> {
    // console.log('1', new Date().toISOString())
    // await pause(1);
    
    const gUser = req.user as Guser;
    const email = gUser?.emails?.[0]?.value;
    const dbUser = await User.findOne({ email: email });
    const token = await createToken(dbUser as IUser);
    res.redirect(CLIENT_URL + 'auth/login?token=' + token);
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(CLIENT_URL);
});

export default router;
import {Router, Request, Response, CookieOptions} from 'express';
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
    const gUser = req.user as Guser;
    const email = gUser?.emails?.[0]?.value;
    const dbUser = await User.findOne({ email: email });
    const token = await createToken(dbUser as IUser);
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,  // 24hours
    };
    res.cookie('jwt', token, cookieOptions);
    res.redirect(CLIENT_URL + 'auth/login?userId=' + dbUser?.id + '&userEmail=' + email);
  }
);

router.get("/logout", (req, res) => {
  res.clearCookie('jwt');
  return res.status(200).json('');
});

export default router;
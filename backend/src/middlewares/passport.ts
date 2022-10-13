import { Request } from "express";
import User from "../models/user";
import { Strategy as LocalJwtStrategy } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import config from "../config/config";

const cookieExtractor = function(req: Request) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt'];
  }
  return token;
};

const localJwtStrategy = new LocalJwtStrategy(
  {
    secretOrKey: config.jwtSecret,
    jwtFromRequest : (req)=> cookieExtractor(req),
  },
  async (payload, done) => {
    try {
      const user = await User.findById(payload.id);
      if (user) {
        return done(null, user);
      }
      return done(null, null);
    } catch (error) {
      console.log(error);
    }
  }
);

const googleStrategy = new GoogleStrategy(
  {
    clientID: config.googleClientId as string,
    clientSecret: config.googleClientSecret as string,
    callbackURL: `/auth/google/callback`,
  },
  async function (accessToken, refreshToken, profile, done) {
    console.log([profile.emails]);
    // save google_id, and google_access_token in their own columns
    // google_access_token is not used in this app
    // it is required to access google services
    const gUser = profile;
    const email = gUser?.emails?.[0]?.value;
    const google_id = gUser?.id;
    const dbUser = await User.findOne({ email: email });
    if (dbUser) {
      dbUser.google_access_token = accessToken;
      dbUser.google_id = google_id,
      await dbUser.save();
    } else {
      const newUser = new User({
        email: email, 
        google_id: google_id,
        google_access_token: accessToken,
      });
      await newUser.save();
    }

    done(null, profile);
  }
);

export {localJwtStrategy, googleStrategy};

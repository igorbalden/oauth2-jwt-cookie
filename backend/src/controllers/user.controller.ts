import { CookieOptions, Request, Response } from "express";
// This IUser import from here, is used in passport.ts middleware
import User, { IUser } from "../models/user";
import { createToken } from "../utils/createToken";

export const signUp = async (
  req: Request,
  res: Response
): Promise<Response> => {
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({ error: "Please. Send your email and password" });
  }

  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({ error: "The User already Exists" });
  }

  const newUser = new User(req.body);
  await newUser.save();
  return res.status(201).json(newUser);
};

export const login = async (
  req: Request,
  res: Response
): Promise<Response> => {

  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({ error: "Please. Send your email and password" });
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ error: "The User does not exist" });
  }
  const isMatch = await user.comparePassword(req.body.password);
  if (isMatch) {
    const token = createToken(user);
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,  // 24hours
    };
    res.cookie('jwt', token, cookieOptions);
    return res.status(200).json({user: { id: user.id, email:user.email }});
  }

  return res.status(400).json({
    error: "The email or password are incorrect"
  });
};

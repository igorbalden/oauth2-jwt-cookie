import { Router } from "express";
import passport from "passport";

import { dashboard } from "../controllers/dashboard.controller";

const router = Router();

router.get(
  "/dashboard",
  passport.authenticate(['jwt',], { session: false, }),
  dashboard
);

export default router;

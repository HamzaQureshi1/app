import { Router } from "express";
import authRoutes from "./auth.js";
import appointmentsRoutes from "./appointments.js";

const rootRouter = Router();

rootRouter.use('/auth', authRoutes)
rootRouter.use('/appointments', appointmentsRoutes)

export default rootRouter;
import { createAppointment } from "../controllers/appointments.js"
import { errorHandler } from '../error-handler.js'
import {Router} from 'express'
import authMiddleware from "../middleware/auth.js";

const appointmentsRoutes = Router()

appointmentsRoutes.post('/', [authMiddleware] ,errorHandler(createAppointment));

export default appointmentsRoutes
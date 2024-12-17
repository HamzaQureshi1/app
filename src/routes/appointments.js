import { createAppointment, updateAppointment, deleteAppointment, listAppointments, viewMyAppointments } from "../controllers/appointments.js"
import { errorHandler } from '../error-handler.js'
import {Router} from 'express'
import authMiddleware from "../middleware/auth.js";
import adminMiddleware from "../middleware/admin.js"

const appointmentsRoutes = Router()

appointmentsRoutes.post('/', [authMiddleware] ,errorHandler(createAppointment));
appointmentsRoutes.put('/:id', [authMiddleware], errorHandler(updateAppointment))
appointmentsRoutes.delete('/:id', [authMiddleware], errorHandler(deleteAppointment))
appointmentsRoutes.get('/list', [authMiddleware, adminMiddleware], errorHandler(listAppointments))
appointmentsRoutes.get('/personal', [authMiddleware], errorHandler(viewMyAppointments))






export default appointmentsRoutes
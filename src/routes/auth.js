import {Router} from 'express'
import { signup, login } from '../controllers/auth.js'
import { errorHandler } from '../error-handler.js'

const authRoutes = Router()

authRoutes.post('/signup', errorHandler(signup) )

authRoutes.post('/login', errorHandler(login) )

export default authRoutes;
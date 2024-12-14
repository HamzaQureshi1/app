import {Router} from 'express'
import { signup, login, me } from '../controllers/auth.js'
import { errorHandler } from '../error-handler.js'
import authMiddleware from '../middleware/auth.js'

const authRoutes = Router()

authRoutes.post('/signup', errorHandler(signup) )

authRoutes.post('/login', errorHandler(login) )

authRoutes.get('/me', [authMiddleware], errorHandler(me))

export default authRoutes;
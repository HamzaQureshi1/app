import express  from 'express'
import { PORT } from './secrets.js'
import rootRouter from './routes/index.js'
import { PrismaClient} from '@prisma/client'
import { errorMiddleware } from './middleware/error.js'
import { SignUpSchema } from './schema/users.js'
import cors from "cors";
import cookieParser from 'cookie-parser'

const corsOptions = {
    origin: ["http://localhost:5173"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true, // Allow cookies and credentials if needed
}

const app = express()

app.use(cors(corsOptions));

app.use(cookieParser())

app.use(express.json())

app.use('/api', rootRouter);

export const prismaClient = new PrismaClient({
    log: ['query']
})

app.use(errorMiddleware);

app.listen(PORT, () => {console.log('App working')})
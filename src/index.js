import express  from 'express'
import { PORT } from './secrets.js'
import rootRouter from './routes/index.js'
import { PrismaClient} from '@prisma/client'
import { errorMiddleware } from './middleware/error.js'
import { SignUpSchema } from './schema/users.js'
import cors from "cors";
import cookieParser from 'cookie-parser'
import { createLogger, format, transports } from 'winston';


const app = express()

app.use(cookieParser())

const corsOptions = {
    origin: ["http://localhost:5173", "https://appointment-tool.netlify.app"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true, // Allow cookies and credentials if needed
}

app.use(cors(corsOptions));

app.set("trust proxy", 2)

app.use(express.json())

app.use('/api', rootRouter);

export const prismaClient = new PrismaClient({
    log: ['query']
})

export const logger = createLogger({
  level: 'info',
  format: format.combine(
      format.timestamp(),
      format.json()
  ),
  transports: [
      new transports.Console(), // Log to console
      new transports.File({ filename: 'failed-logins.log' }) // Log to a file
  ]
});


app.use(errorMiddleware);

app.listen(PORT, () => {console.log('App working')})


import express  from 'express'
import { PORT } from './secrets.js'
import rootRouter from './routes/index.js'
import { PrismaClient} from '@prisma/client'
import { errorMiddleware } from './middleware/error.js'
import { SignUpSchema } from './schema/users.js'

const app = express()

app.use(express.json())

app.use('/api', rootRouter);

export const prismaClient = new PrismaClient({
    log: ['query']
})

app.use(errorMiddleware);

app.listen(PORT, () => {console.log('App working')})
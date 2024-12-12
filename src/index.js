import express  from 'express'
import { PORT } from './secrets.js'
import rootRouter from './routes/index.js'
import { PrismaClient} from '@prisma/client'

const app = express()

app.use(express.json())

app.use('/api', rootRouter);

export const prismaClient = new PrismaClient({
    log: ['query']
})

app.listen(PORT, () => {console.log('App working')})
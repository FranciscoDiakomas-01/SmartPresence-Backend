import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import CoordRouter from './routes/CoordRoute'
import AdminRouter from './routes/AdminRoute'
import TeacherRouter from './routes/TeacherRoute'
import VerifyHeaders from './middlewares/headers'
dotenv.config()

const app = express()
app.use(cors())
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(CoordRouter)
app.use(AdminRouter);
app.use(TeacherRouter)
app.use(VerifyHeaders)

export default app
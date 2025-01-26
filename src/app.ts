import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import CoordRouter from './routes/CoordRoute'
import AdminRouter from './routes/AdminRoute'
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(CoordRouter)
app.use(AdminRouter);


export default app
import {Pool} from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const db = new Pool({
  user : process.env.DBUSER,
  host : process.env.DBHOST,
  port :  Number(process.env.DBPORT),
  database : process.env.DATABASE,
  password : process.env.DBPASSWORD
})

export default db
import {Client, Pool} from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const db = new Pool({
  connectionString: String(process.env.DBURL),
  ssl : {rejectUnauthorized : false}
});
db.connect(() =>{
  console.log("co")
})

export default db
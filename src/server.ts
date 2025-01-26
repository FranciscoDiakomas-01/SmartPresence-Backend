import server from "./app";
import dotenv from 'dotenv'
import RunMigration from "./database/runnMigrations";
import InsertDeFaultAdmin from "./database/defaultAdmin";
dotenv.config()

const port = process.env.PORT
console.log("wait while admin is being inserted")
RunMigration().then(async()=>{
  console.log("Migration Runned")
}).catch((err)=>{
})

setTimeout(() => {
  InsertDeFaultAdmin().then(()=>{
    console.log("admin inserted")
  }).catch()
},5000)
server.listen(port , ()=>{
  console.log(`Server runnig on http://localhost:${port}/`)
})
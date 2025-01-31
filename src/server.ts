import server from "./app";
import dotenv from 'dotenv'
import RunMigration from "./database/runnMigrations";
import InsertDeFaultAdmin from "./database/defaultAdmin";
import VerifyOuterVacations from "./util/vacatons";
import veriFyMissingTeachers from "./util/Presence/verifyLateTeachers";
dotenv.config()

const port = process.env.PORT

RunMigration().then(async()=>{
  console.log("Migration Runned")
}).catch((err)=>{
})

VerifyOuterVacations()
  .then(async () => {
    console.log("Migration Runned");
  })
  .catch((err) => {});

veriFyMissingTeachers()
  .then(async () => {
     console.log("Professores verificados");
  })
  .catch((err) => {});


setInterval(async () => {
  await VerifyOuterVacations();
  await veriFyMissingTeachers();
}, 10000);

setTimeout(() => {
  InsertDeFaultAdmin().then(()=>{
    console.log("admin inserted")
  }).catch()
},10000)

server.listen(port , ()=>{
  console.log(`Server runnig on http://localhost:${port}/`)
})
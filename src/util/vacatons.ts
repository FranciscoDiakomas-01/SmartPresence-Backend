import db from "../database/dbConnection";
import fs from 'node:fs'
import path from "node:path";

export default async function VerifyOuterVacations(){
  let query = "SELECT id , concat(name , ' ' , lastname) as fullname ,  vocation_date FROM teacher WHERE vocation_date != 'no'"
  const  { rows , rowCount }  = await db.query(query)
  const TeacherInVacation = rows
  const date = new Date()
  if(rowCount == 0){
    console.log("Nehum professor com férias pendetes encotradas")
    return 
  }
  console.log(`${rowCount} Professor(s) está(m) em férias`)
  const today = `${date.getDate()}/${String(date.getMonth() + 1).padStart(2 ,"0")}/${date.getFullYear()}`
  TeacherInVacation.forEach( async(teacher) => {
    if(teacher.vocation_date == today){
      await db.query("UPDATE teacher SET vocation_date = 'no' WHERE id = $1" , [teacher.id]);
      const report = `\nProfessor : ${teacher.fullname} || Id : ${teacher.id} || Férias : ${today} || Status : Terminadas.`;
      fs.appendFileSync(path.join(process.cwd() + '/config/vocation.txt') , report)
    }
  })
}

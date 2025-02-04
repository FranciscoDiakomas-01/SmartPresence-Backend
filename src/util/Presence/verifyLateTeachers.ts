import db from "../../database/dbConnection";

export default async function veriFyMissingTeachers() {

  const weekDays = ["Domingo" , "Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira" , "Sábado"];
  const date = new Date()
  const today = weekDays[date.getDay()]
  let query = "SELECT teacher_id , week_day FROM calendar WHERE week_day = $1"
  const { rowCount  , rows } =  await db.query(query , [today])
  if(rowCount == 0){
    console.log("No Pendete Teachers")
    return 
  }else{
    rows.map(async(teacher) => {
      const teacher_id = teacher.teacher_id
      //verificar a presenca do mesmo
      query = "SELECT status FROM presence WHERE teacher_id = $1;"
      await db.query(query , [teacher_id] , (err , data)=>{
        if(err){
          throw new Error(err.message)
        }
        if(data.rowCount == 0){
          return 
        }
        data.rows.map(async( presence) => {
          if(presence?.status == 3 && date.getHours() >= 19){
            query = "UPDATE presence SET status = 2 WHERE teacher_id = $1"
            await db.query(query , [teacher_id])
          }
        })
      })
    })
    console.log("Professores verificados");
    return
  }
}
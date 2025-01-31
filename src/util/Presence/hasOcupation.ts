import db from "../../database/dbConnection";

export default async function hasOcupation(teacher_id : number , week_day : string) {
  
  let query = "SELECT id FROM calendar WHERE teacher_id = $1 AND wee_day = $2 LIMIT 1;"
  try {
    const { rowCount } = await db.query(query, [teacher_id, week_day]);
    query = "SELECT status FROM teacher WHERE id = $1 LIMIT 1;"
    const {rows } = await db.query(query , [teacher_id])
    if(rowCount != 0 && rows[0].status == 1){
      return true
    }else{
      return false
    }
  } catch (error) {
    return false
  }
}

import db from "../../database/dbConnection";
import type IPresence from "../../models/Presence";
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()
export default async function isValidPresence(presence : IPresence){

  try {
    interface IPayLoad {
      id: number;
      isadm: boolean | string;
    }
    const payload = jwt.verify(presence.token_teacher,String(process.env.JWT)
    ) as IPayLoad;
    const  { id , isadm } = payload
    const weekDays = ["Domingo" , "Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira" , "Sábado"];
    const date = new Date()
    const today = weekDays[date.getDay()]
    const { rowCount : isPendete, rows} = await db.query("SELECT * FROM presence WHERE status = 3 AND teacher_id = $1" , [id]);
    console.log(rows)
    if(isPendete != null && isPendete != 0){
      return "Presença Pendente encotrada"
    }
    if(isadm == "teacher"){
      const { rowCount } = await db.query("SELECT name FROM teacher WHERE id = $1;", [id])
      if(rowCount == 0){
        return "Professor não encotrado"
      }
      const { rows } = await db.query("SELECT id , hour_start FROM calendar WHERE week_day = $1 AND teacher_id = $2", [today , id]);
      const hour = String(rows[0]?.hour_start).split(":")[0]
      if (rows.length == 0) {
        return "O professor não possui ocupação";
      }

      const diff = Number(Number(hour) - Number(presence.hour))
      
      if(diff >= 1){
        return "Hora inválida"
      }
      return "valid"
    }else{
      return "Erro na leitura"
    }
  } catch (error) {
    console.log(error)
    return "invalid token"
  }
}
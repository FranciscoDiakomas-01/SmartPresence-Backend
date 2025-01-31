import type ICalendar from "../../models/Calenadar";
import db from "../../database/dbConnection";
import HourDiff from "./hourDiff";

export default async function isValiCalendar( calendar : ICalendar){
  const { rowCount , rows } = await db.query("SELECT * FROM calendar WHERE teacher_id = $1" , [calendar.teacher_id])
  const total_daysInWork = Number(rowCount)
  const weekDays = ["Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira"];
  try {
    const alreadyExist = rows.map(date => {
      return date?.week_day == calendar?.week_day && date?.hour_start == calendar?.hour_start
    })
    const has = alreadyExist.some((date) =>{ return date == true})
    if(has){
      return "already in use"
    }
    if(HourDiff(calendar.hour_start , calendar.hour_end) < 1 ){
      return "invalid hour"
    }
    if(!weekDays.includes(calendar?.week_day)){
      return "invalid day"
    }else if(total_daysInWork >= 5){
      return "already busy"
    }
    else{
      return "valid"
    }
  } catch (error) {
    
  }
}
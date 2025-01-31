import db from "../database/dbConnection";
import ICalendar from "../models/Calenadar";

class CalendarServiceEmplemetation {
  
  #query: string = "";
  async create(calendar: ICalendar) {
    this.#query = "INSERT INTO calendar(teacher_id , week_day , hour_start , hour_end) VALUES($1 , $2 , $3 , $4)";
    await db.query(this.#query, [
      calendar.teacher_id,
      calendar.week_day,
      calendar.hour_start,
      calendar.hour_end,
    ]);
    return "inserted";
  }

  async get(teacherid: number) {
    this.#query = "SELECT week_day , hour_start , hour_end  FROM calendar WHERE teacher_id  = $1;";
    const { rows } = await db.query(this.#query, [teacherid]);
    const response = {
      data: rows,
    };
    return response;
  }

  async delete(id: number) {
    this.#query = "DELETE FROM calendar  WHERE id = $1;";
    const { rowCount } = await db.query(this.#query, [id]);
    return rowCount != null && rowCount != 0;
  }
}
const CalendarService = new CalendarServiceEmplemetation();

export default CalendarService;

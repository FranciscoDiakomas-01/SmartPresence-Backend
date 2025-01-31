import db from "../database/dbConnection";
import IPresence from "../models/Presence";

class PrsenceServiceEmplementation {

  #query: string = "";

  public async create(presence: IPresence) {
    this.#query = "INSERT INTO presence(teacher_id , date , status ) VALUES($1 , $2 , $3 )";
    await db.query(this.#query, [presence.teacher_id,presence.date, 3]);
    return "inserted";
  }

  public async update(presenceid : number  , teacher_id : number) {
    await db.query("UPDATE presence SET status = 1 WHERE id = $2 And teacher_id = $2;", [presenceid , teacher_id])
    return "updated";
  }

  public async getLatest(limit: number, page: number) {
    this.#query = "SELECT * FROM presence OFFSET $1 LIMIT $2;";
    const { rowCount } = await db.query("SELECT id from presence;");
    const offset = (page - 1) * limit;
    const lastpage = Math.ceil(Number(rowCount) / limit);
    const { rows } = await db.query(this.#query, [offset, limit]);
    const response = {
      data: rows,
      total: rowCount,
      lastpage,
      limit,
      page,
    };
    return response;
  }


  public async getByteacherId(teacherid: number , limit : number , page : number) {
    this.#query = "SELECT * FROM presence  WHERE teacher_id = $1 OFFSET $2 LIMIT $3;";
    const { rowCount } = await db.query("SELECT id from presence WHERE teacher_id = $1;", [teacherid]);
    const offset = (page - 1) * limit;
    const lastpage = Math.ceil(Number(rowCount) / limit);
    const { rows } = await db.query(this.#query, [teacherid , offset, limit]);
    const response = {
      data: rows,
      total: rowCount,
      lastpage,
      limit,
      page,
    };
    return response;
  }
}
const PresenceService = new PrsenceServiceEmplementation();

export default PresenceService;

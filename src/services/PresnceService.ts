import db from "../database/dbConnection";
import IPresence from "../models/Presence";

class PrsenceServiceEmplementation {
  #query: string = "";

  public async create(presence: IPresence) {
    this.#query ="INSERT INTO presence(teacher_id , date , status ) VALUES($1 , $2 , $3 )";
    await db.query(this.#query, [presence.teacher_id, presence.date, 3]);
    return "inserted";
  }

  public async update(presenceid: number  , date : string) {
    await db.query(
      "UPDATE presence SET status = 1 , date = $1 WHERE id = $2;",
      [ date , presenceid]
    );
    return "updated";
  }

  public async getLatest(limit: number, page: number) {
    try {
      this.#query =
        "SELECT presence.id as id , presence.date as date , presence.status as status , Concat(teacher.name ,' '  ,teacher.lastname) as name FROM presence JOIN teacher ON presence.teacher_id = teacher.id WHERE presence.teacher_id = teacher.id OFFSET $1 LIMIT $2;";
      const { rowCount } = await db.query("SELECT id from presence;");
      const offset = (page - 1) * limit;
      const lastpage = Math.ceil(Number(rowCount) / limit);
      const { rows } = await db.query(this.#query, [offset, limit]);
      const response = {
        data: rows,
        lastpage,
        limit,
        page,
      };
      return response;
    } catch (error) {
      return {
        error: "error",
      };
    }
  }

  public async getByteacherId(teacherid: number, limit: number, page: number) {
    try {
      this.#query =
        "SELECT * FROM presence  WHERE teacher_id = $1 OFFSET $2 LIMIT $3;";
      const { rowCount } = await db.query(
        "SELECT id from presence WHERE status = 1 AND teacher_id = $1;",
        [teacherid]
      );
      const { rows: total } = await db.query(
        "SELECT count(*) as total FROM presence WHERE status = 2 AND teacher_id = $1",
        [teacherid]
      );
      const { rows: total1 } = await db.query(
        "SELECT count(*) as total FROM presence WHERE status = 1 AND teacher_id = $1",
        [teacherid]
      );
      const offset = (page - 1) * limit;
      const lastpage = Math.ceil(Number(rowCount) / limit);
      const { rows } = await db.query(this.#query, [teacherid, offset, limit]);

      const response = {
        data: rows,
        total: rowCount,
        missings: total[0].total,
        presence: total1[0].total,
        lastpage,
        limit,
        page,
      };
      return response;
    } catch (error) {
      return {
        error: "error",
      };
    }
  }
}
const PresenceService = new PrsenceServiceEmplementation();

export default PresenceService;

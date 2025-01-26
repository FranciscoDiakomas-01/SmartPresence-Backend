import db from "../database/dbConnection";
import type ICoord from "../models/Coord";
import { Encrypt } from "../util/password";

class CoordServiceEmplementation {
  #query: string = "";

  async create(coord: ICoord) {
    this.#query = "INSERT INTO coord(name , lastname , email , password) VALUES($1 , $2 , $3 , $4)";
    return new Promise((resolve, reject) => {
      const encpassword = Encrypt(coord.password);
      db.query(
        this.#query,
        [coord.name, coord.lastname, coord.email, encpassword],
        (err, data) => {
          if (err) {
            reject("already exist");
            return;
          } else {
            resolve("created");
            return;
          }
        }
      );
    });
  }

  async update(coord: ICoord): Promise<string | number> {
    this.#query =
      "UPDATE coord SET name = $1 , lastname = $2, email = $3, password = $4 , updated_at = now() WHERE id = $5;";
    return new Promise((resolve, reject) => {
      const encpassword = Encrypt(coord.password);
      db.query(
        this.#query,
        [coord.name, coord.lastname, coord.email, encpassword, coord.id],
        (err, data) => {
          if (err) {
            reject(err.message);
            return;
          } else {
            resolve(data.rows[0]?.id as number);
            return;
          }
        }
      );
    });
  }

  async getAll(limit: number, page: number) {
    this.#query =
      "SELECT name , lastname , email , status FROM coord OFFSET $1 LIMIT $2;";
    const { rowCount } = await db.query("SELECT id from coord;");
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

  async toogleStatus(id: number, status: boolean) {
    this.#query = "UPDATE coord SET status =$1 WHERE id = $2;";
    const { rowCount } = await db.query(this.#query, [status, id]);
    return rowCount != null && rowCount != 0;
  }

  async delete(id: number) {
    this.#query = "DELETE FROM coord  WHERE id = $1;";
    const { rowCount } = await db.query(this.#query, [id]);
    return rowCount != null && rowCount != 0;
  }
  async getbyid(id: number) {
    this.#query = "SELECT name , lastname , email , status FROM coord WHERE id = $1";
    const { rowCount , rows} = await db.query(this.#query, [id]);
    return rowCount != null && rowCount != 0 ? rows : "not found";
  }
}
const CoordSerice = new CoordServiceEmplementation()
export default CoordSerice
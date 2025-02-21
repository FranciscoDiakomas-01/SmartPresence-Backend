import { off } from "node:process";
import db from "../database/dbConnection";
import IUser from "../models/User";
import type ILogin from "../types/ILogin";
import { Decrypt, Encrypt } from "../util/password";

class TeacherServiceEmplementation {
  #query: string = "";
  async create(teacher: IUser) {
    this.#query =
      "INSERT INTO teacher(name , lastname , email , password , vocation_date ) VALUES($1 , $2 , $3 , $4 , 'no')";
    return new Promise((resolve, reject) => {
      db.query(
        this.#query,
        [
          teacher.name,
          teacher.lastname,
          teacher.email,
          teacher.password,
        ],
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

  async update(teacher: IUser): Promise<string | number> {
    this.#query =
      "UPDATE teacher SET name = $1 , lastname = $2, email = $3, password = $4 , updated_at = now() WHERE id = $5;";
    return new Promise((resolve, reject) => {
      const encpassword = Encrypt(teacher.password);
      db.query(
        this.#query,
        [
          teacher.name,
          teacher.lastname,
          teacher.email,
          encpassword,
          teacher.id,
        ],
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
      "SELECT  id , name , lastname , email , status, vocation_date , to_char(created_at, 'YYYY:MM:DD') as created_at FROM teacher OFFSET $1 LIMIT $2;";
    const { rowCount } = await db.query("SELECT id from teacher;");
    const offset = (page - 1) * limit;
    const lastpage = Math.ceil(Number(rowCount) / limit);
    try {
      const { rows } = await db.query(this.#query, [offset, limit]);
      const response = {
        data: rows,
        total: rowCount,
        lastpage,
        limit,
        page,
      };
      return response;
    } catch (error) {}
  }

  async getAllBySearchText(limit: number, page: number, filter: string) {
    this.#query = `SELECT  id , name , lastname , email , status , qrcodeurl , vocation_date ,  to_char(created_at, 'YYYY:MM:DD') as created_at FROM teacher WHERE name LIKE '%${filter}%' OR lastname LIKE '%${filter}%'  OR email LIKE '%${filter}%' ORDER BY id OFFSET $1 LIMIT $2;`;
    const { rowCount } = await db.query("SELECT id from teacher;");
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

  async toogleStatus(id: number, status: number, date: string = "") {
    this.#query =
      "UPDATE teacher SET status = $1 , vocation_date = $2  WHERE id = $3;";
    const { rowCount } = await db.query(this.#query, [status, date, id]);
    return rowCount != null && rowCount != 0;
  }

  async delete(id: number) {
    this.#query = "DELETE FROM teacher  WHERE id = $1;";
    const { rowCount } = await db.query(this.#query, [id]);
    return rowCount != null && rowCount != 0;
  }
  async getbyid(id: number) {
    this.#query =
      "SELECT id , name , lastname , email , status , qrcodeurl , to_char(created_at, 'YYYY:MM:DD') as created_at, vocation_date FROM teacher WHERE id = $1";
    const { rowCount, rows } = await db.query(this.#query, [id]);
    return rowCount != null && rowCount != 0 ? rows[0] : "not found";
  }

  async getAllNames(limit: number) {
    if (!Number.isNaN(limit)) {
      this.#query =
        "SELECT id , name , lastname , email FROM teacher LIMIT $1;";
      const { rows } = await db.query(this.#query, [limit]);
      return rows;
    } else {
      this.#query =
        "SELECT id , name , lastname , email FROM teacher";
      const { rows } = await db.query(this.#query);
      return rows;
    }
  }

  async login(login: ILogin) {
    this.#query =
      "SELECT id , password , status FROM teacher WHERE email = $1";
    const { rows, rowCount } = await db.query(this.#query, [login.email]);
    if (rowCount == 0) {
      return "not found";
    }
    const id = rows[0]?.id;
    const password = Decrypt(String(rows[0]?.password));
    if (password == login.password) {
      return id;
    } else {
      return "incorret credentials";
    }
  }
}
const TeacherService = new TeacherServiceEmplementation();
export default TeacherService;

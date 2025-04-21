"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbConnection_1 = __importDefault(require("../database/dbConnection"));
const password_1 = require("../util/password");
class TeacherServiceEmplementation {
    #query = "";
    async create(teacher) {
        this.#query =
            "INSERT INTO teacher(name , lastname , email , password , vocation_date ) VALUES($1 , $2 , $3 , $4 , 'no')";
        return new Promise((resolve, reject) => {
            dbConnection_1.default.query(this.#query, [
                teacher.name,
                teacher.lastname,
                teacher.email,
                teacher.password,
            ], (err, data) => {
                if (err) {
                    reject("already exist");
                    return;
                }
                else {
                    resolve("created");
                    return;
                }
            });
        });
    }
    async update(teacher) {
        this.#query =
            "UPDATE teacher SET name = $1 , lastname = $2, email = $3, password = $4 , updated_at = now() WHERE id = $5;";
        return new Promise((resolve, reject) => {
            const encpassword = (0, password_1.Encrypt)(teacher.password);
            dbConnection_1.default.query(this.#query, [
                teacher.name,
                teacher.lastname,
                teacher.email,
                encpassword,
                teacher.id,
            ], (err, data) => {
                if (err) {
                    reject(err.message);
                    return;
                }
                else {
                    resolve(data.rows[0]?.id);
                    return;
                }
            });
        });
    }
    async getAll(limit, page) {
        this.#query =
            "SELECT  id , name , lastname , email , status, vocation_date , to_char(created_at, 'YYYY:MM:DD') as created_at FROM teacher OFFSET $1 LIMIT $2;";
        const { rowCount } = await dbConnection_1.default.query("SELECT id from teacher;");
        const offset = (page - 1) * limit;
        const lastpage = Math.ceil(Number(rowCount) / limit);
        try {
            const { rows } = await dbConnection_1.default.query(this.#query, [offset, limit]);
            const response = {
                data: rows,
                total: rowCount,
                lastpage,
                limit,
                page,
            };
            return response;
        }
        catch (error) { }
    }
    async getAllBySearchText(limit, page, filter) {
        this.#query = `SELECT  id , name , lastname , email , status , qrcodeurl , vocation_date ,  to_char(created_at, 'YYYY:MM:DD') as created_at FROM teacher WHERE name LIKE '%${filter}%' OR lastname LIKE '%${filter}%'  OR email LIKE '%${filter}%' ORDER BY id OFFSET $1 LIMIT $2;`;
        const { rowCount } = await dbConnection_1.default.query("SELECT id from teacher;");
        const offset = (page - 1) * limit;
        const lastpage = Math.ceil(Number(rowCount) / limit);
        const { rows } = await dbConnection_1.default.query(this.#query, [offset, limit]);
        const response = {
            data: rows,
            total: rowCount,
            lastpage,
            limit,
            page,
        };
        return response;
    }
    async toogleStatus(id, status, date = "") {
        this.#query =
            "UPDATE teacher SET status = $1 , vocation_date = $2  WHERE id = $3;";
        const { rowCount } = await dbConnection_1.default.query(this.#query, [status, date, id]);
        return rowCount != null && rowCount != 0;
    }
    async delete(id) {
        this.#query = "DELETE FROM teacher  WHERE id = $1;";
        const { rowCount } = await dbConnection_1.default.query(this.#query, [id]);
        return rowCount != null && rowCount != 0;
    }
    async getbyid(id) {
        this.#query =
            "SELECT id , name , lastname , email , status , qrcodeurl , to_char(created_at, 'YYYY:MM:DD') as created_at, vocation_date FROM teacher WHERE id = $1";
        const { rowCount, rows } = await dbConnection_1.default.query(this.#query, [id]);
        return rowCount != null && rowCount != 0 ? rows[0] : "not found";
    }
    async getAllNames(limit) {
        if (!Number.isNaN(limit)) {
            this.#query =
                "SELECT id , name , lastname , email FROM teacher LIMIT $1;";
            const { rows } = await dbConnection_1.default.query(this.#query, [limit]);
            return rows;
        }
        else {
            this.#query =
                "SELECT id , name , lastname , email FROM teacher";
            const { rows } = await dbConnection_1.default.query(this.#query);
            return rows;
        }
    }
    async login(login) {
        this.#query =
            "SELECT id , password , status FROM teacher WHERE email = $1";
        const { rows, rowCount } = await dbConnection_1.default.query(this.#query, [login.email]);
        if (rowCount == 0) {
            return "not found";
        }
        const id = rows[0]?.id;
        const password = (0, password_1.Decrypt)(String(rows[0]?.password));
        if (password == login.password) {
            return id;
        }
        else {
            return "incorret credentials";
        }
    }
}
const TeacherService = new TeacherServiceEmplementation();
exports.default = TeacherService;

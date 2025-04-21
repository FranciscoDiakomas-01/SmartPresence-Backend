"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbConnection_1 = __importDefault(require("../database/dbConnection"));
const password_1 = require("../util/password");
class CoordServiceEmplementation {
    #query = "";
    async create(coord) {
        this.#query =
            "INSERT INTO coord(name , lastname , email , password) VALUES($1 , $2 , $3 , $4)";
        return new Promise((resolve, reject) => {
            dbConnection_1.default.query(this.#query, [coord.name, coord.lastname, coord.email, coord.password], (err, data) => {
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
    async update(coord) {
        this.#query =
            "UPDATE coord SET name = $1 , lastname = $2, email = $3, password = $4 , updated_at = now() WHERE id = $5;";
        return new Promise((resolve, reject) => {
            const encpassword = (0, password_1.Encrypt)(coord.password);
            dbConnection_1.default.query(this.#query, [coord.name, coord.lastname, coord.email, encpassword, coord.id], (err, data) => {
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
            "SELECT  id , name , lastname , email , status , to_char(created_at, 'YYYY:MM:DD') as created_at FROM coord OFFSET $1 LIMIT $2;";
        const { rowCount } = await dbConnection_1.default.query("SELECT id from coord;");
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
    async getAllBySearchText(filter) {
        this.#query = `SELECT  id , name , lastname , email , status , to_char(created_at, 'YYYY:MM:DD') as created_at  FROM coord WHERE name LIKE '%${filter}%' OR lastname LIKE '%${filter}%'  OR email LIKE '%${filter}%' ORDER BY id;`;
        const { rows } = await dbConnection_1.default.query(this.#query);
        const response = {
            data: rows,
        };
        return response;
    }
    async toogleStatus(id, status) {
        this.#query = "UPDATE coord SET status =$1 WHERE id = $2;";
        const { rowCount } = await dbConnection_1.default.query(this.#query, [status, id]);
        return rowCount != null && rowCount != 0;
    }
    async delete(id) {
        this.#query = "DELETE FROM coord  WHERE id = $1;";
        const { rowCount } = await dbConnection_1.default.query(this.#query, [id]);
        return rowCount != null && rowCount != 0;
    }
    async getbyid(id) {
        this.#query =
            "SELECT id , name , lastname , email , status , to_char(created_at, 'YYYY:MM:DD') as created_at FROM coord WHERE id = $1";
        const { rowCount, rows } = await dbConnection_1.default.query(this.#query, [id]);
        return rowCount != null && rowCount != 0 ? rows[0] : "not found";
    }
    async login(login) {
        this.#query = "SELECT id , password  FROM coord WHERE email = $1 AND status = true;";
        const { rows, rowCount } = await dbConnection_1.default.query(this.#query, [login.email]);
        if (rowCount == 0) {
            return "Conta não encotrada";
        }
        const id = rows[0]?.id;
        const password = (0, password_1.Decrypt)(String(rows[0]?.password));
        if (password == login.password) {
            return id;
        }
        else {
            return "Credenciais incorretas";
        }
    }
}
const CoordSerice = new CoordServiceEmplementation();
exports.default = CoordSerice;

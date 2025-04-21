"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbConnection_1 = __importDefault(require("../database/dbConnection"));
class PrsenceServiceEmplementation {
    #query = "";
    async create(presence) {
        this.#query = "INSERT INTO presence(teacher_id , date , status ) VALUES($1 , $2 , $3 )";
        await dbConnection_1.default.query(this.#query, [presence.teacher_id, presence.date, 3]);
        return "inserted";
    }
    async update(presenceid, date) {
        await dbConnection_1.default.query("UPDATE presence SET status = 1 , date = $1 WHERE id = $2;", [date, presenceid]);
        return "updated";
    }
    async getLatest(limit, page) {
        try {
            this.#query =
                "SELECT presence.id as id , presence.date as date , presence.status as status , Concat(teacher.name ,' '  ,teacher.lastname) as name FROM presence JOIN teacher ON presence.teacher_id = teacher.id WHERE presence.teacher_id = teacher.id OFFSET $1 LIMIT $2;";
            const { rowCount } = await dbConnection_1.default.query("SELECT id from presence;");
            const offset = (page - 1) * limit;
            const lastpage = Math.ceil(Number(rowCount) / limit);
            const { rows } = await dbConnection_1.default.query(this.#query, [offset, limit]);
            const response = {
                data: rows,
                lastpage,
                limit,
                page,
            };
            return response;
        }
        catch (error) {
            return {
                error: "error",
            };
        }
    }
    async getByteacherId(teacherid, limit, page) {
        try {
            this.#query =
                "SELECT * FROM presence  WHERE teacher_id = $1 OFFSET $2 LIMIT $3;";
            const { rowCount } = await dbConnection_1.default.query("SELECT id from presence WHERE status = 1 AND teacher_id = $1;", [teacherid]);
            const { rows: total } = await dbConnection_1.default.query("SELECT count(*) as total FROM presence WHERE status = 2 AND teacher_id = $1", [teacherid]);
            const { rows: total1 } = await dbConnection_1.default.query("SELECT count(*) as total FROM presence WHERE status = 1 AND teacher_id = $1", [teacherid]);
            const offset = (page - 1) * limit;
            const lastpage = Math.ceil(Number(rowCount) / limit);
            const { rows } = await dbConnection_1.default.query(this.#query, [teacherid, offset, limit]);
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
        }
        catch (error) {
            return {
                error: "error",
            };
        }
    }
}
const PresenceService = new PrsenceServiceEmplementation();
exports.default = PresenceService;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbConnection_1 = __importDefault(require("../database/dbConnection"));
class CalendarServiceEmplemetation {
    #query = "";
    async create(calendar) {
        this.#query = "INSERT INTO calendar(teacher_id , week_day , hour_start , hour_end) VALUES($1 , $2 , $3 , $4)";
        await dbConnection_1.default.query(this.#query, [
            calendar.teacher_id,
            calendar.week_day,
            calendar.hour_start,
            calendar.hour_end,
        ]);
        return "inserted";
    }
    async get(teacherid) {
        this.#query = "SELECT week_day , id , hour_start , hour_end  FROM calendar WHERE teacher_id  = $1;";
        const { rows } = await dbConnection_1.default.query(this.#query, [teacherid]);
        const response = {
            data: rows,
        };
        return response;
    }
    async delete(id) {
        this.#query = "DELETE FROM calendar  WHERE id = $1;";
        const { rowCount } = await dbConnection_1.default.query(this.#query, [id]);
        return rowCount != null && rowCount != 0;
    }
}
const CalendarService = new CalendarServiceEmplemetation();
exports.default = CalendarService;

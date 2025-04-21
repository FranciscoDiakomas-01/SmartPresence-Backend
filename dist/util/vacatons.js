"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = VerifyOuterVacations;
const dbConnection_1 = __importDefault(require("../database/dbConnection"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
async function VerifyOuterVacations() {
    let query = "SELECT id , concat(name , ' ' , lastname) as fullname ,  vocation_date FROM teacher WHERE vocation_date != 'no'";
    const { rows, rowCount } = await dbConnection_1.default.query(query);
    const TeacherInVacation = rows;
    const date = new Date();
    if (rowCount == 0) {
        console.log("Nehum professor com férias pendetes encotradas");
        return;
    }
    console.log(`${rowCount} Professor(s) está(m) em férias`);
    const today = `${date.getDate()}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
    TeacherInVacation.forEach(async (teacher) => {
        if (teacher.vocation_date == today) {
            await dbConnection_1.default.query("UPDATE teacher SET vocation_date = 'no' WHERE id = $1", [teacher.id]);
            const report = `\nProfessor : ${teacher.fullname} || Id : ${teacher.id} || Férias : ${today} || Status : Terminadas.`;
            node_fs_1.default.appendFileSync(node_path_1.default.join(process.cwd() + '/config/vocation.txt'), report);
        }
    });
}

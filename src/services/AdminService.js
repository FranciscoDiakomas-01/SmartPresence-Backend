"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbConnection_1 = __importDefault(require("../database/dbConnection"));
const password_1 = require("../util/password");
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
class AdminServiceEmplemetation {
    #query = "";
    async update(Admin) {
        this.#query = "UPDATE admin SET name = $1 , lastname = $2 , email = $3 , password = $4 , updated_at = now();";
        const { rowCount } = await dbConnection_1.default.query(this.#query, [Admin.name, Admin.lastname, Admin.email, Admin.password]);
        return rowCount != 0 && rowCount != null;
    }
    async get() {
        this.#query = "SELECT name  , lastname , email  FROM admin;";
        const { rows } = await dbConnection_1.default.query(this.#query);
        return rows[0];
    }
    async login(login) {
        this.#query = "SELECT id , password  FROM admin WHERE email = $1;";
        const { rows, rowCount } = await dbConnection_1.default.query(this.#query, [login.email]);
        if (rowCount == 0) {
            return "Admin não encontrado";
        }
        const id = rows[0]?.id;
        const password = (0, password_1.Decrypt)(String(rows[0]?.password));
        console.log(password, login);
        if (password == login.password) {
            return id;
        }
        else {
            return "Credenciais incorretas" + password ;
        }
    }
    async dahsBoard() {
        this.#query = "SELECT count(*)  as total FROM coord;";
        const { rows: total_coord } = await dbConnection_1.default.query(this.#query);
        this.#query = "SELECT count(*) as total FROM teacher;";
        const { rows: total_teacher } = await dbConnection_1.default.query(this.#query);
        return { total_teacher: total_teacher[0].total, total_coord: total_coord[0].total };
    }
    getAdminVariable() {
        try {
            const coordVariable = node_fs_1.default.readFileSync(node_path_1.default.join(process.cwd() + '/config/coord.txt'), { encoding: 'utf8' });
            const teacherVariable = node_fs_1.default.readFileSync(node_path_1.default.join(process.cwd() + '/config/teacher.txt'), { encoding: 'utf8' });
            return { coordVariable, teacherVariable };
        }
        catch (error) {
            return "Admin files config doesn´t found";
        }
    }
    UpdateAdminVariable(coord, teacher) {
        try {
            node_fs_1.default.writeFileSync(node_path_1.default.join(process.cwd() + '/config/coord.txt'), coord, { encoding: 'utf8' });
            node_fs_1.default.writeFileSync(node_path_1.default.join(process.cwd() + '/config/teacher.txt'), teacher, { encoding: 'utf8' });
            return "Variáveis Actualizado";
        }
        catch (error) {
            return "Admin files config doesn´t found";
        }
    }
}
const AdminService = new AdminServiceEmplemetation();
exports.default = AdminService;

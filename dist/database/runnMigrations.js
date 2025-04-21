"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RunMigration;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const dbConnection_1 = __importDefault(require("./dbConnection"));
async function RunMigration() {
    const files = node_fs_1.default.readdirSync(node_path_1.default.join(process.cwd() + "/src/migrations"));
    if (files.length > 0) {
        files.map(async (file) => {
            const filePath = node_path_1.default.join(process.cwd() + '/src/migrations/' + file);
            const content = node_fs_1.default.readFileSync(filePath).toString();
            if (content.length == 0) {
                throw new Error("Migration Empty Error");
            }
            dbConnection_1.default.query(content, (err, result) => {
                if (err) {
                    console.log(err.message);
                    process.exit(1);
                }
            });
        });
    }
    else {
        throw new Error("No Migration Found");
    }
}

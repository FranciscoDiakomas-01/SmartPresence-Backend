"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
const runnMigrations_1 = __importDefault(require("./database/runnMigrations"));
const defaultAdmin_1 = __importDefault(require("./database/defaultAdmin"));
const vacatons_1 = __importDefault(require("./util/vacatons"));
const verifyLateTeachers_1 = __importDefault(require("./util/Presence/verifyLateTeachers"));
dotenv_1.default.config();
const port = process.env.PORT;
(0, runnMigrations_1.default)()
    .then(async () => {
    console.log("Migration Runned");
})
    .catch((err) => { });
(0, vacatons_1.default)()
    .then(async () => {
    console.log("Migration Runned");
})
    .catch((err) => { });
(0, verifyLateTeachers_1.default)()
    .then(async () => {
    console.log("Professores verificados");
})
    .catch((err) => { });
setInterval(async () => {
    await (0, vacatons_1.default)();
    await (0, verifyLateTeachers_1.default)();
}, 10000);
setTimeout(() => {
    (0, defaultAdmin_1.default)()
        .then(() => {
        console.log("admin inserted");
    })
        .catch();
}, 5000);
app_1.default.get("/", (req, res) => {
    res.status(200).json({
        msg: "Bem vindo ao smart presence",
    });
});
app_1.default.listen(port, () => {
    console.log(`Server runnig on http://localhost:${port}/`);
});

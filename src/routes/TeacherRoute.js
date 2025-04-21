"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TeacherController_1 = __importDefault(require("../controllers/TeacherController"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const TeacherRouter = (0, express_1.Router)();
TeacherRouter.get("/teachers", auth_1.default, TeacherController_1.default.get);
TeacherRouter.get("/allteachers", auth_1.default, TeacherController_1.default.getAll);
TeacherRouter.get("/teachers/search/:search", auth_1.default, TeacherController_1.default.getbySearchText);
TeacherRouter.get("/teacher", auth_1.default, TeacherController_1.default.getbyid);
TeacherRouter.post("/teacher", auth_1.default, TeacherController_1.default.create);
TeacherRouter.post("/teacher/login", TeacherController_1.default.login);
TeacherRouter.put("/teacher", auth_1.default, TeacherController_1.default.update);
TeacherRouter.put("/teacherstatus", auth_1.default, TeacherController_1.default.toogle);
TeacherRouter.delete("/teacher/:id", auth_1.default, TeacherController_1.default.delete);
exports.default = TeacherRouter;

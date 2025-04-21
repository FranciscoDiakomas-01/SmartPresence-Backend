"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AdminController_1 = __importDefault(require("../controllers/AdminController"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const AdminRouter = (0, express_1.Router)();
AdminRouter.get("/admin", auth_1.default, AdminController_1.default.get);
AdminRouter.get("/admin/dash", auth_1.default, AdminController_1.default.dashBoard);
AdminRouter.get("/adminvariable", auth_1.default, AdminController_1.default.getAdminVariable);
AdminRouter.put("/adminvariable", auth_1.default, AdminController_1.default.updateAdminVariable);
AdminRouter.put("/admin", auth_1.default, AdminController_1.default.update);
AdminRouter.post("/admin/login", AdminController_1.default.login);
exports.default = AdminRouter;

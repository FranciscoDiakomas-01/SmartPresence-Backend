"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../middlewares/auth"));
const PresenceController_1 = __importDefault(require("../controllers/PresenceController"));
const PresenceRoute = (0, express_1.Router)();
PresenceRoute.get("/presence/:id", auth_1.default, PresenceController_1.default.getbyTeacher);
PresenceRoute.get("/presence", auth_1.default, PresenceController_1.default.get);
PresenceRoute.get("/teacherpresence", auth_1.default, PresenceController_1.default.getByTeacherToken);
PresenceRoute.post("/presence", auth_1.default, PresenceController_1.default.create);
PresenceRoute.put("/presence", auth_1.default, PresenceController_1.default.update);
exports.default = PresenceRoute;

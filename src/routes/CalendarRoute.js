"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../middlewares/auth"));
const CalendarController_1 = __importDefault(require("../controllers/CalendarController"));
const CalendarRoute = (0, express_1.Router)();
CalendarRoute.get("/calendar/:id", auth_1.default, CalendarController_1.default.get);
CalendarRoute.get("/calendar", auth_1.default, CalendarController_1.default.getbytoken);
CalendarRoute.get("/calendarbytoken/:token", auth_1.default, CalendarController_1.default.get);
CalendarRoute.post("/calendar/:id", auth_1.default, CalendarController_1.default.create);
CalendarRoute.delete("/calendar/:id", auth_1.default, CalendarController_1.default.delete);
exports.default = CalendarRoute;

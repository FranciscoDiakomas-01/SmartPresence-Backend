import { Router } from "express";
import VerifyToken from "../middlewares/auth";
import CalendarController from "../controllers/CalendarController";

const CalendarRoute = Router();
CalendarRoute.get("/calendar/:id", VerifyToken , CalendarController.get);
CalendarRoute.post("/calendar/:id", VerifyToken , CalendarController.create);
CalendarRoute.delete("/calendar/:id", VerifyToken, CalendarController.delete);

export default CalendarRoute;

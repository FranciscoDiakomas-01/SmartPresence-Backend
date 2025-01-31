import { Router } from "express";
import VerifyToken from "../middlewares/auth";
import PresenceController from "../controllers/PresenceController";
const PresenceRoute = Router();
PresenceRoute.get("/presence/:id", VerifyToken , PresenceController.getbyTeacher);
PresenceRoute.get("/presence", VerifyToken, PresenceController.get);
PresenceRoute.post("/presence", VerifyToken , PresenceController.create);
PresenceRoute.put("/presence/:id", VerifyToken , PresenceController.update);
export default PresenceRoute;

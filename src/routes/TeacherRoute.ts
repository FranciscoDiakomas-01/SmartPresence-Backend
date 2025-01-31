import { Router } from "express";
import TeacherController from "../controllers/TeacherController";
import VerifyToken from "../middlewares/auth";
const TeacherRouter = Router();

TeacherRouter.get("/teachers", VerifyToken , TeacherController.get);
TeacherRouter.get("/teachers/search/:search", VerifyToken, TeacherController.getbySearchText);
TeacherRouter.get("/teacher", VerifyToken, TeacherController.getbyid);
TeacherRouter.post("/teacher", VerifyToken , TeacherController.create);
TeacherRouter.post("/teacher/login", TeacherController.login);
TeacherRouter.put("/teacher", VerifyToken , TeacherController.update);
TeacherRouter.put("/teacherstatus", VerifyToken , TeacherController.toogle);
TeacherRouter.delete("/teacher/:id", VerifyToken , TeacherController.delete);

export default TeacherRouter;

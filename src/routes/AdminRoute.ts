import { Router } from "express";
import AdminController from "../controllers/AdminController";
import VerifyToken from "../middlewares/auth";
const AdminRouter = Router()
AdminRouter.get("/admin", VerifyToken , AdminController.get);
AdminRouter.get("/adminvariable", VerifyToken, AdminController.getAdminVariable);
AdminRouter.put("/adminvariable", VerifyToken, AdminController.updateAdminVariable);
AdminRouter.put("/admin", VerifyToken , AdminController.update);
AdminRouter.post("/admin/login", AdminController.login);
export default AdminRouter
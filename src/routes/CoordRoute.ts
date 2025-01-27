import { Router } from "express";
import CoordController from "../controllers/CoordController";
import VerifyToken from "../middlewares/auth";
const CoordRouter = Router();

CoordRouter.get("/coords", VerifyToken , CoordController.get);
CoordRouter.get("/coords/search/:search", VerifyToken, CoordController.getbySearchText);
CoordRouter.get("/coord", VerifyToken, CoordController.getbyid);
CoordRouter.post("/coord", VerifyToken , CoordController.create);
CoordRouter.post("/coord/login", CoordController.login);
CoordRouter.put("/coord", VerifyToken , CoordController.update);
CoordRouter.put("/coordstatus", VerifyToken , CoordController.toogle);
CoordRouter.delete("/coord/:id", VerifyToken , CoordController.delete);

export default CoordRouter;

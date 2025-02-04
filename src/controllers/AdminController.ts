import type IAdmin from "../models/Admin";
import AdminService from "../services/AdminService";
import { Request, Response } from "express";
import isValidAdmin from "../util/Admin/isValid";
import type ILogin from "../types/ILogin";
import isValidLogin from "../util/Login/isValidLogin";
import GenerateToken from "../middlewares/token";
import isAdmin from "../util/Admin/isAdmin";
import type AdminVariables from "../types/AdminVariable";
import isValidAdminVariables from "../util/Admin/isValidVariables";
import { Encrypt } from "../util/password";
import isAdminAcountOwner from "../util/Admin/isAdminOwnerAcount";
const AdminController = {
  async update(req: Request, res: Response) {
    const Admin: IAdmin = req.body;
    const token: string = req.body.token;
    if (isAdmin(token)) {
      const isvalid = isValidAdmin(Admin);
      if (isvalid == "valid") {
        isAdminAcountOwner(Admin)
          .then((data) => {
            Admin.password = Encrypt(Admin.password);
            AdminService.update(Admin);
            res.status(201).json({
              msg: "Perfil Altedado",
            });
            return;
          })
          .catch((err) => {
            res.status(400).json({
              msg: err,
            });
            return;
          });
      } else {
        res.status(400).json({
          msg: isvalid,
        });
        return;
      }
    } else {
      res.status(403).json({
        msg: "Permissão inválida",
      });
      return;
    }
  },
  async get(req: Request, res: Response) {
    const token: string = req.body.token;
    if (isAdmin(token)) {
      const data = await AdminService.get();
      res.status(201).json(data);
    } else {
      res.status(403).json({
        msg: "Permissão inválida",
      });
      return;
    }
  },

  async dashBoard(req: Request, res: Response) {
    const token: string = req.body.token;
    if (isAdmin(token)) {
      const data = await AdminService.dahsBoard();
      res.status(201).json(data);
    } else {
      res.status(403).json({
        msg: "Permissão inválida",
      });
      return;
    }
  },
  async getAdminVariable(req: Request, res: Response) {
    const token: string = req.body.token;
    if (isAdmin(token)) {
      const data = AdminService.getAdminVariable();
      res.status(201).json(data);
    } else {
      res.status(403).json({
        msg: "Permissão inválida",
      });
      return;
    }
  },
  async updateAdminVariable(req: Request, res: Response) {
    const token: string = req.body.token;
    const admimVariables: AdminVariables = req.body;
    if (isAdmin(token)) {
      if (isValidAdminVariables(admimVariables) == "valid") {
        const data = AdminService.UpdateAdminVariable(
          admimVariables.coord,
          admimVariables.teacher
        );
        res.status(201).json({ data });
        return;
      } else {
        res.status(400).json({ smg: "Váriáveis inválidas" });
        return;
      }
    } else {
      res.status(403).json({
        msg: "Permissão inválida",
      });
      return;
    }
  },
  async login(req: Request, res: Response) {
    const login: ILogin = req.body;
    const isvalid = isValidLogin(login);
    if (isvalid) {
      const response = await AdminService.login(login);
      if (isNaN(response)) {
        res.status(400).json({
          error: "Credenciais incorretas",
        });
        return;
      }
      const token = GenerateToken(response, "admin");
      res.status(200).json({
        token,
        msg: "Bem vindo admin",
      });
      return;
    } else {
      res.status(400).json({
        error: "Seu email ou senha está incorreto",
      });
      return;
    }
  },
};

export default AdminController;

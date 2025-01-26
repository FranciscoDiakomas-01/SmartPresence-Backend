import type IAdmin from "../models/Admin";
import AdminService from "../services/AdminService";
import { Request, Response } from "express";
import isValidAdmin from "../util/Admin/isValid";
import type ILogin from "../types/ILogin";
import isValidLogin from "../util/Login/isValidLogin";
import GenerateToken from "../middlewares/token";
const AdminController = {

  update(req : Request , res : Response){
    const Admin : IAdmin = req.body
    const isvalid = isValidAdmin(Admin)
    if(isvalid == "valid"){
      AdminService.update(Admin)
      res.status(201).json({
        msg : "updated"
      })
      return
    }else{
      res.status(400).json({
        error : isvalid
      })
      return
    }
  }
  ,
  async get(req : Request , res : Response){
    
      const data = await AdminService.get()
      res.status(201).json({
        data
      })
  },
  async login(req : Request , res : Response) {
    const login: ILogin = req.body;
    const isvalid = isValidLogin(login)
    if(isvalid){
      const response = await AdminService.login(login)
      if(isNaN(response)){
        res.status(400).json({
          msg: "wrong credentials admin",
        });
        return;
      }
      const token = GenerateToken(response , true)
      res.status(200).json({
        token,
        msg : "wellcome admin"
      });
      return
    }else{
      res.status(400).json({
        error : "invalid email or password"
      });
      return
    }
  }
}

export default AdminController
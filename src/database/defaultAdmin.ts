
import db from "./dbConnection";
import dotenv from 'dotenv'
import { Encrypt } from '../util/password';
dotenv.config()

export default async function InsertDeFaultAdmin(){

  const password = Encrypt(String(process.env.ADMPASS));
  const admin: {
    email : string,
    password : string,
    name : string,
    lastname : string
  }  = {
    email: String(process.env.ADMEMAIL),
    password: password,
    name : "Francisco",
    lastname: "Diakomas",
  };
  
  const { rowCount } = await db.query("SELECT id FROM admin;")
  if(rowCount == 0){
    await db.query("DELETE FROM teacher");
    await db.query("DELETE FROM coord");
    await db.query("DELETE FROM presence");
    await db.query("DELETE FROM calendar");
    await db.query(
      "INSERT INTO admin(name , lastname , email , password) VALUES($1 , $2 ,$3 ,$4);",
      [admin.name, admin.lastname, admin.email, admin.password]
    );
  }
}
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default function GenerateToken(id : number , isadm: boolean | string = false) {
  const token = jsonwebtoken.sign({ id, isadm  }, String(process.env.JWT));
  return token
}

export  function extractIdInTokem(token : string) {
  try {
    const decodetoken = jsonwebtoken.decode(token)
    return decodetoken;
  } catch (error) {
    return error
  }
  
}

export function verify(token: string) {
  try {
    const isvAdminToken = jsonwebtoken.verify(token , String(process.env.JWT))
    return isvAdminToken
  } catch (error) {
    return error;
  }
}


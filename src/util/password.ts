import dotenv from 'dotenv'
import CryptoJS, { enc } from 'crypto-js'

dotenv.config()

export function Encrypt(password : string){
  
  try {
    const encPass = CryptoJS.AES.encrypt(password ,String(process.env.ENC) )
    return encPass.toString()
  } catch (error) {
    
    return "error";
  }
}


export function Decrypt(password: string) {
  try {
    const encPass = CryptoJS.AES.decrypt(password, String(process.env.ENC)).toString(enc.Utf8);
    return encPass
  } catch (error) {
    return "error"
  }
}

import jwt from 'jsonwebtoken'
export default function isTeacher(token : string){
  const decoded = jwt.decode(token) as { isadm  : string , id : number};
  return decoded.isadm == "teacher";
}
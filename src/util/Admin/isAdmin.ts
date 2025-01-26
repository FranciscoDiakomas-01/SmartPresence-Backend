
import jwt from 'jsonwebtoken'
export default function isAdmin(token : string){
  const decoded = jwt.decode(token) as { isadm  : boolean , id : number};
  return decoded.isadm;
}
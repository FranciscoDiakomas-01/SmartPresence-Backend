import validator from 'validator'
import type IAdmin from '../../models/Admin';
// ** Validação para caso do admin tente alterar os seu dados

export default function isValidAdmin(Admin : IAdmin){

  try {
    if(!validator.isStrongPassword(Admin.password)){
      return "invalid password"
    }else if(!validator.isEmail(Admin.email)){
      return "invalid email"
    }else if(Admin.name?.length < 3){
      return "invalid name"
    }else if(Admin.lastname?.length < 3){
      return "invalid lastname"
    }else{
      return "valid"
    }
  } catch (error) {
    return "invalid"
  }
}
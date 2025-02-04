import validator from 'validator'
import type IAdmin from '../../models/Admin';
// ** Validação para caso do admin tente alterar os seu dados

export default function isValidAdmin(Admin : IAdmin){

  try {
    if(!validator.isStrongPassword(Admin.password)){
      return "Senha fraca"
    }else if(!validator.isEmail(Admin.email)){
      return "Email inválido"
    }else if(Admin.name?.length < 3){
      return "Nome inválido"
    }else if(Admin.lastname?.length < 3){
      return "Sobrenome inválido"
    }else{
      return "valid"
    }
  } catch (error) {
    return "invalid"
  }
}
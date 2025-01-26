import validator from 'validator'
import type ILogin from '../../types/ILogin'

export default function isValidLogin(login : ILogin){

  try {
    return validator.isEmail(login.email) && validator.isStrongPassword(login.password)
  } catch (error) {
    return false
  }
}
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = isValidAdmin;
const validator_1 = __importDefault(require("validator"));
// ** Validação para caso do admin tente alterar os seu dados
function isValidAdmin(Admin) {
    try {
        if (!validator_1.default.isStrongPassword(Admin.password)) {
            return "Senha fraca";
        }
        else if (!validator_1.default.isEmail(Admin.email)) {
            return "Email inválido";
        }
        else if (Admin.name?.length < 3) {
            return "Nome inválido";
        }
        else if (Admin.lastname?.length < 3) {
            return "Sobrenome inválido";
        }
        else {
            return "valid";
        }
    }
    catch (error) {
        return "invalid";
    }
}

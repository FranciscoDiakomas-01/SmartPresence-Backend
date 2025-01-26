
export default interface ITeacher {
  id: number;
  name: string;
  lastname: string;
  qrcode: string;
  email: string;
  password: string;
  telefone: string;
  status: "1" | "2" | "3";
  birthday: string;
  created_at: string;
  updated_at: string;
}
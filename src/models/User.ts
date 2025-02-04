
export default interface IUser {
  id: number;
  name: string;
  lastname: string;
  qrcode: string;
  email: string;
  password: string;
  oldpassword: string;
  oldemail: string;
  status: "1" | "2" | "3";
  created_at: string;
  updated_at: string;
}
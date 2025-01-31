export default interface IPresence {
  id: number;
  teacher_id: number;
  token_teacher: string;
  date: string;
  hour: string;
  status: "Prensete" | "Ausente" | "Pendente";
  obs: string;
  today : string
}

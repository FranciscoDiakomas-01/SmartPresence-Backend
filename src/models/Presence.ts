export default interface IPresence {
  id: number;
  prof_id: number;
  date_in: string;
  date_out: string;
  status: "Prensete" | "Ausente" | "Pendente";
  obs: string;
  created_at: string;
}
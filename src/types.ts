import { NextApiRequest } from "next";

export interface DeckBody {
  deck_owner: string;
  deck_name: string;
}
interface card {
  front: string;
  back: string;
  penalty: number;
  period: number;
}
export interface CardBody {
  deck_name: string;
  cards: card[];
}
export interface UserBody {
  user_name: string;
  password: string;
}

import { userRondier } from "./userRondier.model";

export interface equipe {
    id : number,
    equipe: string,
    quart: string,
    rondiers : userRondier[],
    nomChefQuart :string,
    prenomChefQuart :string,
}
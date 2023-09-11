import { Persona2 } from "./Persona2";
import { Programa } from "./Programa";

export class Usuario2 {
    id: number = 0;
    username: string = '';
    password: string = '';
    enabled: boolean = true;
    programa: Programa = new Programa();
    persona: Persona2 = new Persona2();
    visible: boolean = true;
}

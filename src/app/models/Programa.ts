
export class Programa {
    id_programa: number = 0;
    nombre: string = "";
    descripcion: string = "";
    visible: boolean = false;
}

export interface ProgramaUsuarioDTO {
    id_programa: number;
    nombre: string;
}
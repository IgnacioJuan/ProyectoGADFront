import { Usuario2 } from "./Usuario2";

export class ModeloPoa {
    id_modelo_poa!: number;
    nombre!: string;                        
    descripcion!: string;
    fecha_inicial!: string;
    fecha_final!: string;
    visible!: boolean;
    id_super_admin!: number;
    usuario:Usuario2 | null = new Usuario2;                  
}


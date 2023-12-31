import { Poa } from "./Poa";
import { Usuario2 } from "./Usuario2";

export class ActividadesPoa {
    id_actividad!: number;
    nombre!: string;
    descripcion!: string;
    presupuesto_referencial!: number;
    codificado!: number;
    devengado!: number;
    recursos_propios!: number;
    fecha_creacion!: Date;
    fecha_inicio!: Date;
    fecha_fin!: Date;
    estado!: string
    visible!: boolean;
    usuario!: Usuario2;
    poa!: Poa;

    ///
    totalpresupuestoEterno!: number;
    totalreformaSuplemento!: number;
    totalreformaTIncremento!: number;
    totalreformaTDecremento!: number;

    ///
    valor1!: number;
    valor2!: number;
    valor3!: number;
    valor4!: number;

    institucion!: string;
    valorPE!: number;
}
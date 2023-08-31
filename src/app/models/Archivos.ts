import { ActividadesPoa } from './ActividadesPoa';

export class Archivos {
  id_archivo: number = 0;
  nombre: string = '';
  descripcion: string = '';
  enlace: string = '';
  fecha!: Date;
  valor: number = 0;
  visible: boolean = false;
  actividad: ActividadesPoa | null = null;
}

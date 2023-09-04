import { Poa } from './Poa';
import { Proyecto } from './Proyecto';
import { Usuario2 } from './Usuario2';

export class AprobacionPoa {
  id_aprobacionpoa: number = 0;
  observacion: string = '';
  estado: string = '';
  visible: boolean = false;
  poa: Poa | null = null;
  proyecto: Proyecto | null = null;
  usuario: Usuario2 | null = null;
}

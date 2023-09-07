export class usuario {

  id: number = 0;
  username: string = "";
  pasword: string = "";
  estado: string = "";

  persona!:persona;
}

interface persona{
  id_persona:number;
  primer_nombre:string;
  primer_apellido:string;
  correo:string;
}

export type UsuarioAprobPOA = Pick<usuario, 'id'> & Pick<persona, 'id_persona' | 'primer_nombre' | 'primer_apellido'>;


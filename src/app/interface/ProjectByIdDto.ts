// To parse this data:
//
//   import { Convert } from "./file";
//
//   const projectByIDDto = Convert.toProjectByIDDto(json);

export interface ProjectByIDDto {
    id_proyecto?: number;
    area?: string;
    cargo?: string;
    nombre?: string;
    codigo?: string;
    nombre_componente?: string;
    nombre_objetivo_ods?: string;
    nombre_objetivo_pnd?: string;
    nombre_objetivo_pdot?: string;
    objetivo_proyecto?: string;
    nombre_indicador?: string;
    nombre_meta_pdot?: string;
    nombre_programa?: string;
    nombre_completo_persona?: string;
    rango_fechas?: string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toProjectByIDDto(json: string): ProjectByIDDto[] {
        return JSON.parse(json);
    }

    public static projectByIDDtoToJson(value: ProjectByIDDto[]): string {
        return JSON.stringify(value);
    }
}

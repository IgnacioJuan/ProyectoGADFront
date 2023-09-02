// To parse this data:
//
//   import { Convert } from "./file";
//
//   const projectsActives = Convert.toProjectsActives(json);

export interface ProjectsActives {
    idProyecto?: number;
    codigo?: string;
    meta?: string;
    nombre?: string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toProjectsActives(json: string): ProjectsActives[] {
        return JSON.parse(json);
    }

    public static projectsActivesToJson(value: ProjectsActives[]): string {
        return JSON.stringify(value);
    }
}

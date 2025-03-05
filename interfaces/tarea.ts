import { IActividad } from "./actividad"

export interface ITarea {
    id: string
    codigo: string
    tarea: string
        
    idActividad: string
    actividad: IActividad
}
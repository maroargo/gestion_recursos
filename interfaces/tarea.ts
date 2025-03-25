import { Servicio } from "@prisma/client"
import { IActividad } from "./actividad"

export interface ITarea {
    id: string
    codigo: string
    tarea: string

    inicio: Date | null
    fin: Date | null
    ene: number
    feb: number
    mar: number
    abr: number
    may: number
    jun: number
    jul: number
    ago: number
    set: number
    oct: number
    nov: number
    dic: number
        
    idActividad: string
    actividad: IActividad
    status: string
    
    servicios: Servicio[]
}

export interface IPlaniTarea {
    idActividad: string
    idTarea: string
    codigo: string
    nombre: string 

    idPresupuesto: string //Sirve unicamente para mutate
}



import { Meta } from "@prisma/client"

export interface IActividad {
    id: string
    codigo: string
    actividad: string
        
    idMeta: string
    meta: Meta
    status: string 
}
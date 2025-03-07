import { Presupuesto } from "@prisma/client"

export interface IMeta {
    id: string
    meta: string
    codigo: string    

    idPresupuesto: string
    presupuesto: Presupuesto
    status: string     
}
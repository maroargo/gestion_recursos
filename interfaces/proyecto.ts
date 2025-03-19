import { Periodo } from "@prisma/client"

export interface IProyecto {
    id: string    
    nombre: string
    acronimo: string
        
    idPeriodo: string
    periodo: Periodo
    status: string 
}
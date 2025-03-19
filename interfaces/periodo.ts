import { Organization, Periodo, TipoPresupuesto } from "@prisma/client"

export interface IPeriodo {
    id: string
    periodo: string
    descripcion: string
    nombre: string
    uit: string

    organization: Organization
    idOrganization:  string

    statusPeriodo: string 
    status: string
    
    presupuestos: IPresupuesto[]
}

export interface IPresupuesto {
    id: string
    nombre: string

    periodo: Periodo
    idPeriodo: string
    tipoPresupuesto: TipoPresupuesto
    idTipoPresupuesto: string
    
    procesos: IProceso[]

    status: string
}

export interface IProceso {  
    id: string  
    name: string
    siglas: string

    status: string
}
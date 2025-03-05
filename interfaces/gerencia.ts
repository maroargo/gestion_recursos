import { Organization } from "@prisma/client"

export interface IGerencia {
    id: string
    nombre: string
    siglas: string
    titular: string

    idOrganization: string
    organization: Organization
    status: string     
}

export interface ISubgerencia {
    id: string
    nombre: string
    siglas: string
    titular: string

    idGerencia: string
    gerencia: IGerencia
    status: string     
}

export interface IGerenciaSession {
    idGerencia: string    
    gerencia: string
    idSubgerencia: string    
    subgerencia: string
}
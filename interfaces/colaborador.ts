import { PerfilAcademico } from "@prisma/client"

export interface IColaborador {
    id: string
    dni: string
    ruc: string
    nombres: string
    paterno: string
    materno: string
    correo: string
    celular: string
        
    idPerfilAcademico: string
    perfilAcademico: PerfilAcademico
    status: string 
}
import { GenericaGasto, Gerencia, Meta, Periodo, Presupuesto, Proyecto, Tarea, TipoContrato, UnidadMedida } from "@prisma/client"

export interface IServicio {
    id: string
    descripcion: string
    
    idPresupuesto: string
    presupuesto: Presupuesto    

    idGenericaGasto: string
    genericaGasto: GenericaGasto

    clasificador: string
    idUnidadMedida: string
    unidadMedida: UnidadMedida

    idTarea: string
    tarea: Tarea
    
    idProyecto: string
    proyecto: Proyecto
    
    cantidad: number
    precioUnitario: string
    enero: number
    febrero: number
    marzo: number
    abril: number
    mayo: number
    junio: number
    julio: number
    agosto: number
    setiembre: number
    octubre: number
    noviembre: number
    diciembre: number

    totalCosto: string
    
    status: string    
}
import { GenericaGasto, Gerencia, Meta, Periodo, TipoContrato, TipoPresupuesto, UnidadMedida } from "@prisma/client"
import { ISubgerencia } from "./gerencia"

export interface IServicio {
    id: string
    descripcion: string
    
    idPeriodo: string
    periodo: Periodo
    idGerencia: string
    gerencia: Gerencia
    idSubgerencia: string
    subgerencia: ISubgerencia

    idMeta: string
    meta: Meta
    
    idTipoContrato: string
    tipoContrato: TipoContrato
    idGenericaGasto: string
    genericaGasto: GenericaGasto

    clasificador: string
    idUnidadMedida: string
    unidadMedida: UnidadMedida
    
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
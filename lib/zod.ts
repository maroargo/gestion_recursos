import { Decimal } from "@prisma/client/runtime/library";
import { z, object, string, number, date, boolean } from "zod";
 
export const signInSchema = object({
  email: string({ required_error: "Correo es requerido" })
    .min(1, "Correo es requerido")
    .email("Correo no válido"),
  password: string({ required_error: "Contraseña es requerido" })
    .min(1, "Contraseña es requerido")
    .min(6, "Contraseña debe tener mas de 6 caracteres")
    .max(12, "Contraseña debe tener menos de 12 caracteres")
});

export const userSchema = object({
  name: string({ required_error: "Nombre es requerido" })
    .min(1, "Nombre es requerido"),
  email: string({ required_error: "Correo es requerido" })
    .min(1, "Correo es requerido")
    .email("Correo no válido"),
  phone: string().optional(),
  password: string({ required_error: "Contraseña es requerido" })
    .min(1, "Contraseña es requerido")
    .min(6, "Contraseña debe tener mas de 6 caracteres")
    .max(12, "Contraseña debe tener menos de 12 caracteres"), 
  idOrganization: string().optional(),
  idGerencia: string().optional(),
  idSubgerencia: string({ required_error: "Subgerencia es requerido" })
    .min(1, "Subgerencia es requerido"),
  idRole: string({ required_error: "Rol es requerido" })
    .min(1, "Rol es requerido")  
});

export const userUpdateSchema = object({
  name: string({ required_error: "Nombre es requerido" })
    .min(1, "Nombre es requerido"),
    email: string({ required_error: "Correo es requerido" })
    .min(1, "Correo es requerido")
    .email("Correo no válido"),  
  phone: string({ required_error: "Celular es requerido" })
    .min(1, "Celular es requerido"), 
  idOrganization: string().optional(),
  idGerencia: string().optional(),   
  idSubgerencia: string({ required_error: "Subgerencia es requerido" })
    .min(1, "Subgerencia es requerido"),
  idRole: string({ required_error: "Rol es requerido" })
    .min(1, "Rol es requerido"),
  idStatus: string().optional()
});

export const accessRoleSchema = object({
  idRole: string(),    
  idMenu: string(),
  menu: string(),  
  access: boolean(),
  add: boolean()
});

export const roleSchema = object({ 
  name: string(),   
  idStatus: string().optional(), 
  accessRoles: z.array(accessRoleSchema)
});

export const menuSchema = object({
  name: string({ required_error: "Nombre es requerido" })
    .min(1, "Nombre es requerido"),
  url: string(),    
  icon: string(),
  idMenu: string()
});

export const procesoSchema = object({    
  name: string().optional(),  
  siglas: string().optional(),  
  idStatus: string().optional(),
});

export const presupuestoSchema = object({
  nombre: string().optional(),  
  idTipoPresupuesto: string().optional(), 
  idStatus: string().optional(), 
  procesos: z.array(procesoSchema).optional(),
});

export const periodoSchema = object({
  periodo: string({ required_error: "Período es requerido" })
    .min(1, "Período es requerido"),
  descripcion: string(),    
  nombre: string().optional(),  
  idOrganization: string().optional(),
  idStatusPeriodo: string().optional(),

  idStatus: string().optional(), 
  presupuestos: z.array(presupuestoSchema),  
});

export const organizationSchema = object({
  name: string({ required_error: "Nombre es requerido" })
    .min(1, "Nombre es requerido"),
  email: string({ required_error: "Correo es requerido" })
    .min(1, "Correo es requerido")
    .email("Correo no válido"),
  address: string({ required_error: "Dirección es requerido" })
    .min(1, "Dirección es requerido"),  
  logo: string(),
  idStatus: string().optional()  
});

export const gerenciaSchema = object({
  nombre: string({ required_error: "Nombre es requerido" })
    .min(1, "Nombre es requerido"),
  siglas: string({ required_error: "Siglas es requerido" })
    .min(1, "Siglas es requerido"),    
  titular: string({ required_error: "Titular es requerido" })
    .min(1, "Titular es requerido"),
  idOrganization: string({ required_error: "Organización es requerido" })
    .min(1, "Organización es requerido"),
  idStatus: string().optional()  
});

export const subgerenciaSchema = object({
  nombre: string({ required_error: "Nombre es requerido" })
    .min(1, "Nombre es requerido"),
  siglas: string({ required_error: "Siglas es requerido" })
    .min(1, "Siglas es requerido"),    
  titular: string({ required_error: "Titular es requerido" })
    .min(1, "Titular es requerido"),
  idGerencia: string({ required_error: "Gerencia es requerido" })
    .min(1, "Gerencia es requerido"),
  idStatus: string().optional()  
});

export const metaSchema = object({
  codigo: string({ required_error: "Código es requerido" })
    .min(1, "Código es requerido"),
  meta: string({ required_error: "Meta es requerido" })
    .min(1, "Meta es requerido"),
  idPeriodo: string().optional(), 
  idSubgerencia: string().optional(),       
  idStatus: string().optional()  
});

export const actividadSchema = object({
  codigo: string({ required_error: "Código es requerido" })
    .min(1, "Código es requerido"),
  actividad: string({ required_error: "Actividad es requerido" })
    .min(1, "Actividad es requerido"),
  idMeta: string({ required_error: "Meta es requerido" })
    .min(1, "Meta es requerido"),   
  idStatus: string().optional()  
});

export const tareaSchema = object({
  codigo: string({ required_error: "Código es requerido" })
    .min(1, "Código es requerido"),
  tarea: string({ required_error: "Tarea es requerido" })
    .min(1, "Tarea es requerido"),
  idActividad: string({ required_error: "Actividad es requerido" })
    .min(1, "Actividad es requerido"),   
  idStatus: string().optional()  
});

export const servicioSchema = object({
  descripcion: string({ required_error: "Descripción es requerido" })
    .min(1, "Descripción es requerido"),
  idPeriodo: string().optional(),
  idGerencia: string().optional(),
  idSubgerencia: string({ required_error: "Subgerencia es requerido" })
    .min(1, "Subgerencia es requerido"), 
  idMeta: string({ required_error: "Meta es requerido" })
    .min(1, "Meta es requerido"),   
  idTipoContrato: string({ required_error: "Tipo Contrato es requerido" })
    .min(1, "Tipo Contrato es requerido"),
  idGenericaGasto: string({ required_error: "Genérica Gasto es requerido" })
    .min(1, "Genérica Gasto es requerido"),  
  clasificador: string({ required_error: "Clasificador es requerido" })
    .min(1, "Clasificador es requerido"),  
  idUnidadMedida: string().optional(),
  cantidad: z.number({
      required_error: "Cantidad es requerido",
      invalid_type_error: "Debe ser un número entero",
    })
    .int("Debe ser un número entero")
    .min(1, "Debe ser mayor a 0"),    
  precioUnitario: string().optional(),     
  idStatus: string().optional()  
});

export const defineServicioSchema = object({
  descripcion: string().optional(),  
  cantidad: z.number().optional(),    
  precioUnitario: string().optional(),
  
  enero: z.number().optional(),
  febrero: z.number().optional(),
  marzo: z.number().optional(),
  abril: z.number().optional(),
  mayo: z.number().optional(),
  junio: z.number().optional(),
  julio: z.number().optional(),
  agosto: z.number().optional(),
  setiembre: z.number().optional(),
  octubre: z.number().optional(),
  noviembre: z.number().optional(),
  diciembre: z.number().optional(),
  totalCosto: string().optional(),   
});

export const perfilAcademicoSchema = object({
  cargo: string({ required_error: "Cargo es requerido" })
    .min(1, "Cargo es requerido"),  
  monto: string({ required_error: "Monto es requerido" })
    .min(1, "Monto"),   
  perfilAcademico: string({ required_error: "Perfil Academico es requerido" })
    .min(1, "Apellido Materno es requerido"),  
  carrera: string({ required_error: "Carrera es requerido" })
    .min(1, "Carrera es requerido"),  
  curso: string({ required_error: "Cursos es requerido" })
    .min(1, "Cursos es requerido"),  
  experiencia: string({ required_error: "Experiencia es requerido" })
    .min(1, "Experiencia es requerido"), 
  tiempoExperiencia: string({ required_error: "Tiempo de Experiencia es requerido" })
    .min(1, "Tiempo de Experiencia"),   
  idSubgerencia: string().optional(), 
  idStatus: string().optional()
});

export const colaboradorSchema = object({
  nombres: string({ required_error: "Nombres es requerido" })
    .min(1, "Nombres es requerido"),  
  paterno: string({ required_error: "Apellido Paterno es requerido" })
    .min(1, "Apellido Paterno es requerido"),   
  materno: string({ required_error: "Apellido Materno es requerido" })
    .min(1, "Apellido Materno es requerido"),  
  idStatus: string().optional()
});


export type UserSchema = z.infer<typeof userSchema>;
export type UserUpdateSchema = z.infer<typeof userUpdateSchema>;
export type RoleSchema = z.infer<typeof roleSchema>;
export type MenuSchema = z.infer<typeof menuSchema>;
export type AccessRoleSchema = z.infer<typeof accessRoleSchema>;
export type PeriodoSchema = z.infer<typeof periodoSchema>;
export type OrganizationSchema = z.infer<typeof organizationSchema>;

export type GerenciaSchema = z.infer<typeof gerenciaSchema>;
export type SubgerenciaSchema = z.infer<typeof subgerenciaSchema>;
export type MetaSchema = z.infer<typeof metaSchema>;
export type ActividadSchema = z.infer<typeof actividadSchema>;
export type TareaSchema = z.infer<typeof tareaSchema>;
export type ServicioSchema = z.infer<typeof servicioSchema>;
export type DefineServicioSchema = z.infer<typeof defineServicioSchema>;

export type PerfilAcademicoSchema = z.infer<typeof perfilAcademicoSchema>;
export type ColaboradorSchema = z.infer<typeof colaboradorSchema>;
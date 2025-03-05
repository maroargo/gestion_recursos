import { Role } from "@prisma/client";
import { IRoleSession } from "./role";
import { IOrganizationSession } from "./organization";
import { IGerenciaSession, ISubgerencia } from "./gerencia";

export interface IUser {
  id: string
  name?: string
  email?: string
  phone?: string
  password?: string
  emailVerified?: Date
  image?: string
  status?: string  
  
  idSubgerencia?: string    
  subgerencia?: ISubgerencia

  idRole?: string    
  role?: Role
}

export interface IUserSession {  
  name?: string  
  email?: string  
  idOrganization?: string    
  organization?: IOrganizationSession
  role?: IRoleSession
  gerencia: IGerenciaSession
}

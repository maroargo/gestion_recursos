import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "@/lib/zod";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { Status } from "@prisma/client";
import { IUserSession } from "@/interfaces/user";

export default {
  trustHost: true,
  providers: [    
    Credentials({          
      authorize: async (credentials) => {                         

        const {data, success} = signInSchema.safeParse(credentials);

        if (!success) {
          throw new Error("Credenciales no válidas.");
        }

        //Verify User
        const user = await db.user.findUnique({           
          include: { 
            subgerencia: { 
              include: { 
                gerencia: { 
                  include: { 
                    organization: true,
                  }
                },
              }
            },                       
            role: true
          }, 
          where: {
            email: data.email,
            status: Status.activo
          }
        });        

        if (!user || !user.password) {
          throw new Error("Credenciales no válidas.");
        }

        //Verify Pass
        const isValid = await bcrypt.compare(data.password, user.password);

        if (!isValid) {
          throw new Error("Credenciales no válidas.");
        }    
        
        const userSession: IUserSession = {          
          name: user.name || "",          
          email: user.email, 
          idOrganization: user.subgerencia?.gerencia?.idOrganization || "",
          organization: {            
            name: user.subgerencia?.gerencia?.organization?.name || "",
            logo: user.subgerencia?.gerencia?.organization?.logo || "",            
          },
          gerencia: {            
            idGerencia: user.subgerencia?.idGerencia || "",
            gerencia: user.subgerencia?.gerencia?.nombre || "",
            idSubgerencia: user.idSubgerencia || "",
            subgerencia: user.subgerencia?.nombre || "",
          },         
          role: {  
            id: user.role?.id || "",          
            name: user.role?.name || "",
          }
        }

        return userSession;
        
      }
    })
  ],
} satisfies NextAuthConfig
import { db } from "@/lib/db";
import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import { Status, StatusPeriodo } from "@prisma/client";

export async function GET() {
    try {  
        const session = await auth();                      

        const data = await db.servicio.findMany({ 
            include: {                
                presupuesto: {
                    include: {
                       periodo: true 
                    },
                },                
                genericaGasto: true,
                unidadMedida: true,
                tarea: true,
                proyecto: true,
            },  
            where: {
                AND: [ 
                    { status: Status.activo },                                     
                    { presupuesto: { periodo: { idOrganization: session?.user.idOrganization } } } ,
                ]                                     
            },                                
            orderBy: {
                createdAt: 'asc',
            },
        });         
        
        return NextResponse.json(data);
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}
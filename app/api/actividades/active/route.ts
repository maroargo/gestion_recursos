import { db } from "@/lib/db";
import { Status, StatusPeriodo } from '@prisma/client';
import { NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function GET() {
    try {  
        const session = await auth();                       

        const data = await db.actividad.findMany({ 
            include: {
                meta: {
                    include: {
                        presupuesto: true                        
                    },
                },
            },  
            where: { 
                AND: [
                    { status: Status.activo },
                    { meta: { presupuesto: { periodo: { statusPeriodo: StatusPeriodo.vigente } } } },
                    { meta: { presupuesto: { periodo: { idOrganization: session?.user.idOrganization } } } },                    
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
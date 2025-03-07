import { db } from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";
import { StatusPeriodo } from "@prisma/client";

export async function GET(request: NextRequest) {
    try {  
        const idPresupuesto = request.nextUrl.searchParams.get('idPresupuesto'); 
        
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
                    { meta: { idPresupuesto: idPresupuesto } },
                    { meta: { presupuesto: { periodo: { statusPeriodo: StatusPeriodo.vigente } } } },
                    { meta: { presupuesto: { periodo: { idOrganization: session?.user.idOrganization } } } }
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
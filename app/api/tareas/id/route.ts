import { db } from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";
import { Status, StatusPeriodo } from "@prisma/client";

export async function GET(request: NextRequest) {
    try { 
        const idPresupuesto = request.nextUrl.searchParams.get('idPresupuesto'); 

        const session = await auth();                            
        
        const data = await db.tarea.findMany({ 
            include: {
                actividad: true
            }, 
            where: {
                AND: [
                    { actividad: { meta: { idPresupuesto: idPresupuesto } } },                    
                    { actividad: { meta: { presupuesto: { periodo: { statusPeriodo: StatusPeriodo.vigente } } } } },
                    { actividad: { meta: { presupuesto: { periodo: { idOrganization: session?.user.idOrganization } } } } }
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
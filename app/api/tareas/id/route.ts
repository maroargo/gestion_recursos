import { db } from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";
import { StatusPeriodo } from "@prisma/client";

export async function GET(request: NextRequest) {
    try { 
        const idActividad = request.nextUrl.searchParams.get('idActividad');
        const idPresupuesto = request.nextUrl.searchParams.get('idPresupuesto');         

        const session = await auth();                            
        
        const whereClause: any = {
            AND: [
                { actividad: { meta: { idPresupuesto: idPresupuesto } } },                    
                { actividad: { meta: { presupuesto: { periodo: { statusPeriodo: StatusPeriodo.vigente } } } } },
                { actividad: { meta: { presupuesto: { periodo: { idOrganization: session?.user.idOrganization } } } } },
                { idSubgerencia: session?.user.gerencia?.idSubgerencia },
            ]                                 
        };

        // Solo agregar el filtro de idActividad si tiene un valor válido
        if (idActividad) {
            whereClause.AND.push({ idActividad: idActividad });
        }

        const data = await db.tarea.findMany({ 
            include: {
                actividad: true,
                servicios: true,
            }, 
            where: whereClause,                                
            orderBy: {
                createdAt: 'asc',
            },
        });         
        
        return NextResponse.json(data);
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}
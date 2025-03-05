import { db } from "@/lib/db";
import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import { Status } from "@prisma/client";

export async function GET() {
    try {  
        const session = await auth();        
        const esAdmin = session?.user.role?.name == "Administrador";
        
        //El periodo trabaja desde la Organizacion seleccionada
        const orgPer = await db.organization.findFirst({
            include: {
                periodo: true,
            },
            where: {                
                id: session?.user.idOrganization
            },
        });  

        const idPeriodo = orgPer?.periodo?.id;
        if (!idPeriodo) {
            return NextResponse.json({ message: 'No se encontró un período vigente' }, { status: 404 });
        }
        
        const data = await db.tarea.findMany({ 
            include: {
                actividad: true
            }, 
            where: {
                AND: [
                    { status: Status.activo },
                    { actividad: { meta: { idPeriodo: idPeriodo } } },
                    ...(!esAdmin ? [{ actividad: { meta: { subgerencia: { gerencia: { idOrganization: session?.user.idOrganization } } } } }] : []),
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
import { db } from "@/lib/db";
import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import { Status, StatusPeriodo } from "@prisma/client";

export async function GET() {
    try {  
        const session = await auth();        
        const esAdmin = session?.user.role?.name == "Administrador";
                
        //El periodo trabaja desde la Organizacion seleccionada
        const periodo = await db.periodo.findFirst({
            where: { 
                AND: [
                    { statusPeriodo: StatusPeriodo.vigente },
                    { status: Status.activo },
                    { idOrganization: session?.user.idOrganization },
                ]                
            },
        });

        const data = await db.meta.findMany({ 
            include: {
                subgerencia: true
            }, 
            where: {
                status: Status.activo,  
                idPeriodo: periodo?.id,            
                ...(!esAdmin ? { subgerencia: { gerencia: { idOrganization: session?.user.idOrganization } } } : {}),                
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
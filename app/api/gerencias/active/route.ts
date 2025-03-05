import { db } from "@/lib/db";
import { Status } from '@prisma/client';
import { NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function GET() {
    try { 
        const session = await auth();        
        const esAdmin = session?.user.role?.name == "Administrador";

        const data = await db.gerencia.findMany({ 
            include: {
                organization: true,
                subgerencias: true
            }, 
            where: {
                status: Status.activo,
                ...(!esAdmin ? { idOrganization: session?.user.idOrganization } : {}),                
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

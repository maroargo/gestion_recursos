import { db } from "@/lib/db";
import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import { Status, StatusPeriodo } from "@prisma/client";

export async function GET() {
    try {  
        const session = await auth();        
        
        const data = await db.presupuesto.findMany({ 
            include: {
                periodo: true,
            },             
            where: {
                AND: [
                    { status: Status.activo },
                    { periodo: { statusPeriodo: StatusPeriodo.vigente } },
                    { periodo: { idOrganization: session?.user.idOrganization } }
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
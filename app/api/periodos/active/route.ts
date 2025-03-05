import { db } from "@/lib/db";
import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import { Status } from "@prisma/client";

export async function GET() {
    try {  
        const session = await auth();        
        const esAdmin = session?.user.role?.name == "Administrador";                
        
        const data = await db.periodo.findMany({ 
            include: {
                organization: true,
            },             
            where: {
                AND: [
                    { status: Status.activo },
                    ...(!esAdmin ? [{ idOrganization: session?.user.idOrganization }] : []),                                      
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
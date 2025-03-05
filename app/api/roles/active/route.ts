import { db } from "@/lib/db";
import { Status } from "@prisma/client";
import { NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function GET() {
    try {
        const session = await auth();        
        const esAdmin = session?.user.role?.name == "Administrador";

        const data = await db.role.findMany({
            include: {
                accessRoles: true
            }, 
            where: {
                status: Status.active,                                    
                ...(!esAdmin ? { name: { not: "Administrador" } } : {}),   
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
import { db } from "@/lib/db";
import { Status } from "@prisma/client";
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const data = await db.tipoPresupuesto.findMany({
            where: {
                status: Status.activo,                
            },                    
            orderBy: {
                createdAt: 'asc',
            },
        });
        
        return NextResponse.json(data);
    } catch (error) {        
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}
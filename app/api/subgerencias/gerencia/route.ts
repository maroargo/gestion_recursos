import { db } from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {  
        const idGerencia = request.nextUrl.searchParams.get('idGerencia');        
                                  
        const data = await db.subgerencia.findMany({ 
            include: {
                gerencia: true
            }, 
            where: {
                idGerencia: idGerencia              
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
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try { 
        const idOrganization = request.nextUrl.searchParams.get('idOrganization');

        const data = await db.gerencia.findMany({ 
            include: {
                organization: true,
                subgerencias: true
            }, 
            where: {
                idOrganization: idOrganization                
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

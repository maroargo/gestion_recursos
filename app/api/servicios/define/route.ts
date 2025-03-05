import { db } from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...rest } = body;                                                                       

        const updated = await db.servicio.update({
            where: { id },
            data: {                
                descripcion: rest.descripcion,                                                      
                cantidad: rest.cantidad || 0,
                precioUnitario: rest.precioUnitario,
                enero: rest.enero || 0,
                febrero: rest.febrero || 0,
                marzo: rest.marzo || 0,
                abril: rest.abril || 0,
                mayo: rest.mayo || 0,
                junio: rest.junio || 0,
                julio: rest.julio || 0,
                agosto: rest.agosto || 0,
                setiembre: rest.setiembre || 0,
                octubre: rest.octubre || 0,
                noviembre: rest.noviembre || 0,
                diciembre: rest.diciembre || 0,
                totalCosto: rest.totalCosto,                                
            },
        });

        if (!updated) {
            return NextResponse.json({ message: 'Servicio no válido' }, { status: 404 });
        }

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {               
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}
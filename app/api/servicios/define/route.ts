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
                ene: rest.ene || 0,
                feb: rest.feb || 0,
                mar: rest.mar || 0,
                abr: rest.abr || 0,
                may: rest.may || 0,
                jun: rest.jun || 0,
                jul: rest.jul || 0,
                ago: rest.ago || 0,
                set: rest.set || 0,
                oct: rest.oct || 0,
                nov: rest.nov || 0,
                dic: rest.dic || 0,
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
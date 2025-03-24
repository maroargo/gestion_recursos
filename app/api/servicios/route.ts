import { db } from "@/lib/db";
import { servicioSchema } from '@/lib/zod';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function GET() {
    try {  
        const session = await auth();                      

        const data = await db.servicio.findMany({ 
            include: {                
                presupuesto: {
                    include: {
                       periodo: true 
                    },
                },                
                genericaGasto: true,
                unidadMedida: true,
                tarea: true,
                proyecto: true,
            },  
            where: {
                AND: [                                       
                    { presupuesto: { periodo: { idOrganization: session?.user.idOrganization } } } ,
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

export async function POST(request: NextRequest) {
    try { 
        const session = await auth(); 

        const body = await request.json();
        const result = servicioSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data;               

        const newData = await db.servicio.create({
            data: {
                descripcion: data.descripcion,
                idPresupuesto: data.idPresupuesto,                    
                idGenericaGasto: data.idGenericaGasto,
                clasificador: data.clasificador,
                idUnidadMedida: data.idUnidadMedida,
                idTarea: data.idTarea,
                idProyecto: data.idProyecto,
                cantidad: data.cantidad,
                precioUnitario: data.precioUnitario,                
            },
        });

        return NextResponse.json(newData, { status: 201 });
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const id = request.nextUrl.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'ID Servicio es requerido.' }, { status: 400 });
        }

        const deleted = await db.servicio.delete({
            where: { id },
        });

        if (!deleted) {
            return NextResponse.json({ message: 'Servicio no válido' }, { status: 404 });
        }     

        return NextResponse.json({ message: 'Servicio eliminado.' }, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...rest } = body;                                                                       

        const updated = await db.servicio.update({
            where: { id },
            data: {                
                descripcion: rest.descripcion,                                      
                idPresupuesto: rest.idPresupuesto,                    
                idGenericaGasto: rest.idGenericaGasto,
                clasificador: rest.clasificador,
                idUnidadMedida: rest.idUnidadMedida,
                idTarea: rest.idTarea,
                idProyecto: rest.idProyecto,
                cantidad: rest.cantidad || 0,
                precioUnitario: rest.precioUnitario,
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
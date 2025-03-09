import { db } from "@/lib/db";
import { tareaSchema } from '@/lib/zod';
import { Tarea, Status, StatusPeriodo } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function GET() {
    try {  
        const session = await auth();                      
        
        const data = await db.tarea.findMany({ 
            include: {
                actividad: true
            },  
            where: { 
                AND: [
                    { actividad: { meta: { presupuesto: { periodo: { statusPeriodo: StatusPeriodo.vigente } } } } },
                    { actividad: { meta: { presupuesto: { periodo: { idOrganization: session?.user.idOrganization } } } } },
                    { idSubgerencia: session?.user.gerencia?.idSubgerencia }
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
        const body = await request.json();
        const result = tareaSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data;

        const newData = await db.tarea.create({
            data: {
                codigo: data.codigo,
                tarea: data.tarea,
                idActividad: data.idActividad
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
            return NextResponse.json({ message: 'ID Tarea es requerido.' }, { status: 400 });
        }

        const deleted = await db.tarea.delete({
            where: { id },
        });

        if (!deleted) {
            return NextResponse.json({ message: 'Tarea no válida' }, { status: 404 });
        }     

        return NextResponse.json({ message: 'Tarea eliminada.' }, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await auth();

        const body = await request.json();
        const { id, ...rest } = body;
        const result = tareaSchema.safeParse(rest);
        
        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data as Tarea;

        if (!id) {
            return NextResponse.json({ message: 'Tarea ID es requerido' }, { status: 400 });
        }

        const updated = await db.tarea.update({
            where: { id },
            data: {                
                codigo: data.codigo,
                tarea: data.tarea,
                idActividad: data.idActividad,
                status: rest.idStatus == "0" ? Status.activo : Status.inactivo,                                
            },
        });

        if (!updated) {
            return NextResponse.json({ message: 'Tarea no válida' }, { status: 404 });
        }

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}
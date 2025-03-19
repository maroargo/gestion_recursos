import { db } from "@/lib/db";
import { proyectoSchema } from '@/lib/zod';
import { Proyecto, Status } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function GET() {
    try {  
        const session = await auth();                       

        const data = await db.proyecto.findMany({ 
            include: {
                periodo: true,
            },  
            where: { 
                periodo: { idOrganization: session?.user.idOrganization }           
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
        const result = proyectoSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data;

        const newData = await db.proyecto.create({
            data: {
                nombre: data.nombre,
                acronimo: data.acronimo,
                idPeriodo: data.idPeriodo
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
            return NextResponse.json({ message: 'ID Proyecto es requerido.' }, { status: 400 });
        }

        const deleted = await db.proyecto.delete({
            where: { id },
        });

        if (!deleted) {
            return NextResponse.json({ message: 'Proyecto no válido' }, { status: 404 });
        }     

        return NextResponse.json({ message: 'Proyecto eliminado.' }, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...rest } = body;
        const result = proyectoSchema.safeParse(rest);
        
        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data as Proyecto;

        if (!id) {
            return NextResponse.json({ message: 'Proyecto ID es requerido' }, { status: 400 });
        }

        const updated = await db.proyecto.update({
            where: { id },
            data: {                                
                nombre: data.nombre,
                acronimo: data.acronimo,
                idPeriodo: data.idPeriodo,
                status: rest.idStatus == "0" ? Status.activo : Status.inactivo,
            },
        });

        if (!updated) {
            return NextResponse.json({ message: 'Proyecto no válido' }, { status: 404 });
        }

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}
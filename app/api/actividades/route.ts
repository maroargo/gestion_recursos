import { db } from "@/lib/db";
import { actividadSchema } from '@/lib/zod';
import { Actividad, Meta, Status, StatusPeriodo } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function GET() {
    try {  
        const session = await auth();              
        const esAdmin = session?.user.role?.name == "Administrador";

        //El periodo trabaja desde la Organizacion seleccionada
        const periodo = await db.periodo.findFirst({
            where: { 
                AND: [
                    { statusPeriodo: StatusPeriodo.vigente },
                    { idOrganization: session?.user.idOrganization },
                ]                
            },
        });  

        const data = await db.actividad.findMany({ 
            include: {
                meta: {
                    include: {
                        periodo: true                        
                    },
                },
            },  
            where: {  
                AND: [
                    { meta: { idPeriodo: periodo?.id } },
                    ...(!esAdmin ? [{ meta: { subgerencia: { gerencia: { idOrganization: session?.user.idOrganization } } } }] : [])
                ]               
            },                                
            orderBy: {
                createdAt: 'asc',
            },
        });  
        
        console.log(data);
        
        return NextResponse.json(data);
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const result = actividadSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data;

        const newData = await db.actividad.create({
            data: {
                codigo: data.codigo,
                actividad: data.actividad,
                idMeta: data.idMeta
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
            return NextResponse.json({ message: 'ID Actividad es requerido.' }, { status: 400 });
        }

        const deleted = await db.actividad.delete({
            where: { id },
        });

        if (!deleted) {
            return NextResponse.json({ message: 'Actividad no válida' }, { status: 404 });
        }     

        return NextResponse.json({ message: 'Actividad eliminada.' }, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...rest } = body;
        const result = actividadSchema.safeParse(rest);
        
        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data as Actividad;

        if (!id) {
            return NextResponse.json({ message: 'Actividad ID es requerido' }, { status: 400 });
        }

        const updated = await db.actividad.update({
            where: { id },
            data: {                
                codigo: data.codigo,
                actividad: data.actividad,
                idMeta: data.idMeta,
                status: rest.idStatus == "0" ? Status.activo : Status.inactivo,
            },
        });

        if (!updated) {
            return NextResponse.json({ message: 'Actividad no válida' }, { status: 404 });
        }

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}
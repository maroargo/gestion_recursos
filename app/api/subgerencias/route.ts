import { db } from "@/lib/db";
import { subgerenciaSchema } from '@/lib/zod';
import { Subgerencia, Status } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function GET() {
    try {   
        const session = await auth();              
        const esAdmin = session?.user.role?.name == "Administrador";

        const data = await db.subgerencia.findMany({ 
            include: {
                gerencia: true
            },   
            where: {                
                ...(!esAdmin ? { gerencia: { idOrganization: session?.user.idOrganization } } : {}),                
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
        const result = subgerenciaSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data;

        const newData = await db.subgerencia.create({
            data: {
                nombre: data.nombre,
                siglas: data.siglas,
                titular: data.titular,
                idGerencia: data.idGerencia
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
            return NextResponse.json({ message: 'ID Subgerencia es requerido.' }, { status: 400 });
        }

        const deleted = await db.subgerencia.delete({
            where: { id },
        });

        if (!deleted) {
            return NextResponse.json({ message: 'Subgerencia no válida' }, { status: 404 });
        }     

        return NextResponse.json({ message: 'Subgerencia eliminada.' }, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...rest } = body;
        const result = subgerenciaSchema.safeParse(rest);
        
        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data as Subgerencia;

        if (!id) {
            return NextResponse.json({ message: 'Subgerencia ID es requerido' }, { status: 400 });
        }

        const updated = await db.subgerencia.update({
            where: { id },
            data: {
                nombre: data.nombre,
                siglas: data.siglas,
                titular: data.titular,
                status: rest.idStatus == "0" ? Status.activo : Status.inactivo,                
                idGerencia: data.idGerencia             
            },
        });

        if (!updated) {
            return NextResponse.json({ message: 'Subgerencia no válida' }, { status: 404 });
        }

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}
import { db } from "@/lib/db";
import { gerenciaSchema } from '@/lib/zod';
import { Gerencia, Status } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function GET() {
    try {    
        const session = await auth();              
        const esAdmin = session?.user.role?.name == "Administrador";

        const data = await db.gerencia.findMany({ 
            include: {
                organization: true,
                subgerencias: true
            },    
            where: {                
                ...(!esAdmin ? { idOrganization: session?.user.idOrganization } : {}),                
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
        const result = gerenciaSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data;

        const newData = await db.gerencia.create({
            data: {
                nombre: data.nombre,
                siglas: data.siglas,
                titular: data.titular,
                idOrganization: data.idOrganization
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
            return NextResponse.json({ message: 'ID Gerencia es requerido.' }, { status: 400 });
        }

        const deleted = await db.organization.delete({
            where: { id },
        });

        if (!deleted) {
            return NextResponse.json({ message: 'Gerencia no válida' }, { status: 404 });
        }     

        return NextResponse.json({ message: 'Gerencia eliminada.' }, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...rest } = body;
        const result = gerenciaSchema.safeParse(rest);
        
        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data as Gerencia;

        if (!id) {
            return NextResponse.json({ message: 'Gerencia ID es requerido' }, { status: 400 });
        }

        const updated = await db.gerencia.update({
            where: { id },
            data: {
                nombre: data.nombre,
                siglas: data.siglas,
                titular: data.titular,
                status: rest.idStatus == "0" ? Status.activo : Status.inactivo,                
                idOrganization: data.idOrganization             
            },
        });

        if (!updated) {
            return NextResponse.json({ message: 'Gerencia no válida' }, { status: 404 });
        }

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}
import { db } from "@/lib/db";
import { metaSchema } from '@/lib/zod';
import { Meta, Status, StatusPeriodo } from '@prisma/client';
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
                    ...(!esAdmin ? [{ idOrganization: session?.user.idOrganization }] : []),
                ]                
            },
        }); 
                
        const data = await db.meta.findMany({ 
            include: {
                periodo: true
            },  
            where: {                                                                
                idPeriodo: periodo?.id,
                ...(!esAdmin ? { subgerencia: { gerencia: { idOrganization: session?.user.idOrganization } } } : {}),                                
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
        const result = metaSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data;

        //El periodo trabaja desde la Organizacion seleccionada
        const periodo = await db.periodo.findFirst({
            where: { 
                AND: [
                    { statusPeriodo: StatusPeriodo.vigente },
                    { idOrganization: session?.user.idOrganization },
                ]                
            },
        }); 

        const newData = await db.meta.create({
            data: {
                codigo: data.codigo,
                meta: data.meta,
                idPeriodo: periodo?.id,
                idSubgerencia: session?.user.gerencia?.idSubgerencia
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
            return NextResponse.json({ message: 'ID Meta es requerido.' }, { status: 400 });
        }

        const deleted = await db.meta.delete({
            where: { id },
        });

        if (!deleted) {
            return NextResponse.json({ message: 'Meta no válida' }, { status: 404 });
        }     

        return NextResponse.json({ message: 'Meta eliminada.' }, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await auth();

        const body = await request.json();
        const { id, ...rest } = body;
        const result = metaSchema.safeParse(rest);
        
        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data as Meta;

        if (!id) {
            return NextResponse.json({ message: 'Meta ID es requerido' }, { status: 400 });
        }

        //El periodo trabaja desde la Organizacion seleccionada
        const periodo = await db.periodo.findFirst({
            where: { 
                AND: [
                    { statusPeriodo: StatusPeriodo.vigente },
                    { idOrganization: session?.user.idOrganization },
                ]                
            },
        });

        const updated = await db.meta.update({
            where: { id },
            data: {                
                codigo: data.codigo,
                meta: data.meta,
                status: rest.idStatus == "0" ? Status.activo : Status.inactivo,                
                idPeriodo: periodo?.id,
                idSubgerencia: session?.user.gerencia?.idSubgerencia            
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
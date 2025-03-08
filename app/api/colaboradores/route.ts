import { db } from "@/lib/db";
import { colaboradorSchema } from '@/lib/zod';
import { Colaborador, Status } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function GET() {
    try {  
        const session = await auth();                       

        const data = await db.colaborador.findMany({ 
            include: {
                perfilAcademico: true,
            },  
            where: { 
                perfilAcademico: { subgerencia: { gerencia: { idOrganization: session?.user.idOrganization } } }           
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
        const result = colaboradorSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data;

        const newData = await db.colaborador.create({
            data: {
                dni: data.dni,
                ruc: data.ruc,
                nombres: data.nombres,
                paterno: data.paterno,
                materno: data.materno,
                correo: data.correo,
                celular: data.celular,
                idPerfilAcademico: data.idPerfilAcademico
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
            return NextResponse.json({ message: 'ID Colaborador es requerido.' }, { status: 400 });
        }

        const deleted = await db.colaborador.delete({
            where: { id },
        });

        if (!deleted) {
            return NextResponse.json({ message: 'Colaborador no válido' }, { status: 404 });
        }     

        return NextResponse.json({ message: 'Colaborador eliminado.' }, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...rest } = body;
        const result = colaboradorSchema.safeParse(rest);
        
        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data as Colaborador;

        if (!id) {
            return NextResponse.json({ message: 'Colaborador ID es requerido' }, { status: 400 });
        }

        const updated = await db.colaborador.update({
            where: { id },
            data: {                
                dni: data.dni,
                ruc: data.ruc,
                nombres: data.nombres,
                paterno: data.paterno,
                materno: data.materno,
                correo: data.correo,
                celular: data.celular,
                idPerfilAcademico: data.idPerfilAcademico,
                status: rest.idStatus == "0" ? Status.activo : Status.inactivo,
            },
        });

        if (!updated) {
            return NextResponse.json({ message: 'Colaborador no válido' }, { status: 404 });
        }

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}
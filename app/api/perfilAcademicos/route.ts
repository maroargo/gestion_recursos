import { db } from "@/lib/db";
import { perfilAcademicoSchema } from '@/lib/zod';
import { PerfilAcademico, Status } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function GET() {
    try {
        const session = await auth();              
        const esAdmin = session?.user.role?.name == "Administrador";

        const data = await db.perfilAcademico.findMany({ 
            include: {
                subgerencia: true
            }, 
            where: {                
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
        const result = perfilAcademicoSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data;        

        const newData = await db.perfilAcademico.create({
            data: {
                cargo: data.cargo,
                monto: data.monto,
                perfilAcademico: data.perfilAcademico,
                carrera: data.carrera,
                curso: data.curso,
                experiencia: data.experiencia,
                tiempoExperiencia: data.tiempoExperiencia,
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
            return NextResponse.json({ message: 'ID Perfil Academico es requerido.' }, { status: 400 });
        }

        const deleted = await db.perfilAcademico.delete({
            where: { id },
        });

        if (!deleted) {
            return NextResponse.json({ message: 'Perfil Academico no válido' }, { status: 404 });
        }     

        return NextResponse.json({ message: 'Perfil Academico eliminado.' }, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await auth();
        
        const body = await request.json();
        const { id, ...rest } = body;
        const result = perfilAcademicoSchema.safeParse(rest);
        
        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data as PerfilAcademico;

        if (!id) {
            return NextResponse.json({ message: 'Perfil Academico ID es requerido' }, { status: 400 });
        }

        const updated = await db.perfilAcademico.update({
            where: { id },
            data: {
                cargo: rest.cargo,
                monto: rest.monto,
                perfilAcademico: rest.perfilAcademico,
                carrera: rest.carrera,
                curso: rest.curso,
                experiencia: rest.experiencia,
                tiempoExperiencia: rest.tiempoExperiencia,
                status: rest.idStatus == "0" ? Status.activo : Status.inactivo, 
                idSubgerencia: session?.user.gerencia?.idSubgerencia                             
            },
        });

        if (!updated) {
            return NextResponse.json({ message: 'Perfil Academico no válido' }, { status: 404 });
        }

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}
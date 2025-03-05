import { IRole } from "@/interfaces/role";
import { db } from "@/lib/db";
import { roleSchema } from '@/lib/zod';
import { Status } from "@prisma/client";
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    try {
        const data = await db.role.findMany({
            include: {
                accessRoles: true
            }, 
            where: {
                name: { not: "Administrador" }
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
        const result = roleSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data;

        const newData = await db.role.create({
            data: {
                name: data.name
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
            return NextResponse.json({ message: 'Rol ID es requerido' }, { status: 400 });
        }        

        const deleted = await db.$transaction([
            db.accessRole.deleteMany({
                where: { 
                    idRole: id
                 },
            }),
            db.role.delete({
                where: { id },
            })
        ]);  

        if (!deleted) {
            return NextResponse.json({ message: 'Rol no válido' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Rol eliminado satisfactoriamente' }, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...rest } = body;
        const result = roleSchema.safeParse(rest);
        
        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data as IRole;

        if (!id) {
            return NextResponse.json({ message: 'Rol ID es requerido' }, { status: 400 });
        }

        const updated = await db.role.update({
            where: { id },
            data: {
                name: data.name,
                status: rest.idStatus == "0" ? Status.activo : Status.inactivo
            },
        });

        if (!updated) {
            return NextResponse.json({ message: 'Rol no válido' }, { status: 404 });
        }

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}
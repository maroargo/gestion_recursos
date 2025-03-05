import { db } from "@/lib/db";
import { organizationSchema } from '@/lib/zod';
import { Organization, Status } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function GET() {
    try {
        const session = await auth();              
        const esAdmin = session?.user.role?.name == "Administrador";

        const data = await db.organization.findMany({             
            where: {                
                ...(!esAdmin ? { id: session?.user.idOrganization } : {}),                
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
        const result = organizationSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data;

        const newData = await db.organization.create({
            data: {
                name: data.name,
                email: data.email,
                address: data.address,
                logo: data.logo,                
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
            return NextResponse.json({ message: 'ID Organización es requerido.' }, { status: 400 });
        }

        const deleted = await db.organization.delete({
            where: { id },
        });

        if (!deleted) {
            return NextResponse.json({ message: 'Organización no válida' }, { status: 404 });
        }     

        return NextResponse.json({ message: 'Organización eliminada.' }, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...rest } = body;
        const result = organizationSchema.safeParse(rest);                

        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data as Organization;

        if (!id) {
            return NextResponse.json({ message: 'Organization ID es requerido' }, { status: 400 });
        }

        const updated = await db.organization.update({
            where: { id },
            data: {
                name: data.name,
                email: data.email,
                address: data.address,
                status: rest.idStatus == "0" ? Status.activo : Status.inactivo,
                logo: data.logo,                            
            },
        });

        if (!updated) {
            return NextResponse.json({ message: 'Organización no válida' }, { status: 404 });
        }        

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}
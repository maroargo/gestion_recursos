import { db } from "@/lib/db";
import { userSchema } from '@/lib/zod';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";

import bcrypt from "bcryptjs";
import { Status } from "@prisma/client";

export async function GET() {
    try {
        const data = await db.user.findMany({ 
            include: {                
                subgerencia: {                
                    include: {                
                        gerencia: {                
                            include: {                
                                organization: true                                                        
                            },
                        },                                                        
                    },    
                },
                role: true,                                
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
        const result = userSchema.safeParse(body);

        const session = await auth();

        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data;

        //hash pass
        const passwordHash = await bcrypt.hash(data.password, 10); 

        const newData = await db.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: passwordHash,
                phone: data.phone || "",                 
                idSubgerencia: data.idSubgerencia,                               
                idRole: data.idRole                
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
            return NextResponse.json({ message: 'Usuario ID es requerido' }, { status: 400 });
        }

        const deleted = await db.user.delete({
            where: { id },
        });

        if (!deleted) {
            return NextResponse.json({ message: 'Usuario no válido' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Usuario eliminado satisfactoriamente' }, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...rest } = body;                

        if (!id) {
            return NextResponse.json({ message: 'Usuario ID es requerido' }, { status: 400 });
        }                 

        const updated = await db.user.update({
            where: { id },
            data: {
                name: rest.name,
                email: rest.email,    
                phone: rest.phone,                  
                idSubgerencia: rest.idSubgerencia,                          
                idRole: rest.idRole,
                status: rest.idStatus == "0" ? Status.activo : Status.inactivo
            },
        });

        if (!updated) {
            return NextResponse.json({ message: 'Usuario no válido' }, { status: 404 });
        }

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}
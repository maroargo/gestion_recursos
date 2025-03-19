import { db } from "@/lib/db";
import { Status, StatusPeriodo } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function GET() {
    try {  
        const session = await auth();              
        const esAdmin = session?.user.role?.name == "Administrador";        
        
        const data = await db.periodo.findMany({
            include: {
                organization: true,
                presupuestos: {
                    include: {
                        tipoPresupuesto: true,
                        procesos: true,
                    },
                },
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
        const session = await auth(); 
        const body = await request.json();                 

        const periodo = await db.periodo.create({
            data: {                
                periodo: body.periodo,
                descripcion: body.descripcion,
                nombre: body.nombre,
                uit: body.uit,
                idOrganization: session?.user.idOrganization                
            },
        });        

        for (const pre of body.presupuestos) {
            
            const tipoPres = await db.tipoPresupuesto.findFirst({ 
                where: { id: pre.idTipoPresupuesto }
            }); 

            const presupuesto = await db.presupuesto.create({
                data: {
                    nombre: pre.nombre,
                    idTipoPresupuesto: pre.idTipoPresupuesto,                    
                    idPeriodo: periodo.id    
                }
            });

            //Crear procesos
            if (tipoPres?.value === "2") {
                for (const pro of pre.procesos) {                    
                    await db.proceso.create({
                        data: {                            
                            name: pro.name,
                            siglas: pro.siglas,                            
                            idPresupuesto: presupuesto.id,
                        }
                    });
                }
            }            
        };

        return NextResponse.json(periodo, { status: 201 });
    } catch (error) { 
        console.log(error);       
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const id = request.nextUrl.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'ID Periodo es requerido.' }, { status: 400 });
        }

        const deleted = await db.periodo.delete({
            where: { id },
        });

        if (!deleted) {
            return NextResponse.json({ message: 'Periodo no válida' }, { status: 404 });
        }     

        return NextResponse.json({ message: 'Periodo eliminado.' }, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await auth();

        const body = await request.json();
        const { id, ...rest } = body;        

        if (!id) {
            return NextResponse.json({ message: 'Periodo ID es requerido' }, { status: 400 });
        }

        const updated = await db.periodo.update({
            where: { id },
            data: {                                
                periodo: rest.periodo,
                descripcion: rest.descripcion,
                nombre: rest.nombre,
                uit: rest.uit,
                statusPeriodo: rest.idStatusPeriodo == "0" ? StatusPeriodo.vigente : StatusPeriodo.no_vigente,
                status: rest.idStatus == "0" ? Status.activo : Status.inactivo,    
                idOrganization: session?.user.idOrganization                            
            },
        });

        if (!updated) {
            return NextResponse.json({ message: 'Período no válido' }, { status: 404 });
        }

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}
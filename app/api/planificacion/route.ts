import { db } from "@/lib/db";
import { tareaSchema } from '@/lib/zod';
import { Tarea, Status, StatusPeriodo } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function GET() {
    try {  
        const session = await auth();                      
        
        const data = await db.$queryRaw`
            WITH meta_actividad AS (
                SELECT m.id id_meta, m.meta
                , a.id id_actividad
                , a.actividad
                FROM meta m
                    INNER JOIN actividad a ON a.idMeta = m.id 
                    INNER JOIN presupuesto p ON p.id = m.idPresupuesto
                    INNER JOIN periodo pe ON pe.id = p.idPeriodo
                WHERE pe.idOrganization = ${session?.user.idOrganization}               
            )
            SELECT ma.id_meta
            , ma.meta
            , ma.id_actividad
            , ma.actividad
            , t.id id_tarea
            , t.tarea
            FROM meta_actividad ma
                LEFT JOIN tarea t ON t.idActividad = ma.id_actividad
            WHERE t.idSubgerencia = ${session?.user.gerencia?.idSubgerencia}             
            ORDER BY ma.id_meta, ma.id_actividad, t.id
        `;                  
        
        return NextResponse.json(data);
    } catch (error) { 
        console.log(error);          
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}
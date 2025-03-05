import { db } from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";
import { StatusPeriodo } from "@prisma/client";

export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        const body = await request.json();                
    
        if (!body.reportes || !Array.isArray(body.reportes)) {
            return NextResponse.json({ message: "El formato del archivo es incorrecto" }, { status: 400 });
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
        

        let arrayTareas = [];

        for (const i of body.reportes) { 
            try {
                
                const codigo = i.CODIGO?.toString() ?? null;
                if (codigo != null) {
                    if (codigo.split(".").length == 4) {    //Identifica q es una ACTIVIDAD
                        const newMeta = await db.meta.create({
                            data: {
                                codigo: i.CODIGO_META?.toString(),
                                meta: i.META?.toString(),
                                idPeriodo: periodo?.id,
                                idSubgerencia: session?.user.gerencia?.idSubgerencia
                            },
                        });                    

                        await db.actividad.create({
                            data: {
                                codigo: i.CODIGO?.toString(),
                                actividad: i.NOMBRE?.toString(),
                                idMeta: newMeta.id,

                                inicio: i.INICIO ? (new Date((i.INICIO - 25569) * 86400 * 1000)) : null,
                                fin: i.FIN ? (new Date((i.FIN - 25569) * 86400 * 1000)) : null,
                                ene: i.ENE ?? 0,
                                feb: i.FEB ?? 0,
                                mar: i.MAR ?? 0,
                                abr: i.ABR ?? 0,
                                may: i.MAY ?? 0,
                                jun: i.JUN ?? 0,
                                jul: i.JUL ?? 0,
                                ago: i.AGO ?? 0,
                                set: i.SET ?? 0,
                                oct: i.OCT ?? 0,
                                nov: i.NOV ?? 0,
                                dic: i.DIC ?? 0,
                                total: i.TOTAL ?? 0,
                                prioridad: i.PRIORIDAD?.toString() ?? null,
                            }
                        });
                    }
                    
                    if (codigo.split(".").length == 5) {//Identifica q es una TAREA
                        
                        const actividad = await db.actividad.findFirst({
                            where: { codigo: i.CODIGO.substring(0, i.CODIGO.lastIndexOf(".")) }
                        });

                        if (!actividad) {
                            arrayTareas.push(i);  
                            console.error(`No se encontró la actividad para la tarea con código ${i.CODIGO}`);                          
                            continue; // Saltar esta iteración si no hay actividad
                        }

                        await db.tarea.create({
                            data: {
                                codigo: i.CODIGO?.toString(),
                                tarea: i.NOMBRE?.toString(),
                                idActividad: actividad?.id,

                                inicio: i.INICIO ? (new Date((i.INICIO - 25569) * 86400 * 1000)) : null,
                                fin: i.FIN ? (new Date((i.FIN - 25569) * 86400 * 1000)) : null,
                                ene: i.ENE ?? 0,
                                feb: i.FEB ?? 0,
                                mar: i.MAR ?? 0,
                                abr: i.ABR ?? 0,
                                may: i.MAY ?? 0,
                                jun: i.JUN ?? 0,
                                jul: i.JUL ?? 0,
                                ago: i.AGO ?? 0,
                                set: i.SET ?? 0,
                                oct: i.OCT ?? 0,
                                nov: i.NOV ?? 0,
                                dic: i.DIC ?? 0,
                                total: i.TOTAL ?? 0,                                
                            }
                        });

                        //Insertar finalmente las tareas sin actividad
                        //await db.tarea.createMany({
                        //    data: arrayTareas
                        //});
                    }
                }
                                
            } catch (err) {
                console.error("Error insertando registro:", i, err);
            }            
        }                 

        return NextResponse.json(
          { message: "Datos registrados correctamente" },
          { status: 201 }
        );
      } catch (error) {        
        return NextResponse.json(
          { message: "Error interno del servidor" },
          { status: 500 }
        );
      }
      
}
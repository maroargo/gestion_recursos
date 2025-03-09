import { db } from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";
import { StatusPeriodo } from "@prisma/client";

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
            , t.codigo codigo_tarea
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

export async function POST(request: NextRequest) {
    try {
        const idPresupuesto = request.nextUrl.searchParams.get('idPresupuesto');       

        const body = await request.json();                
    
        if (!body.reportes || !Array.isArray(body.reportes)) {
            return NextResponse.json({ message: "El formato del archivo es incorrecto" }, { status: 400 });
        }                                                 

        let arrayTareas = [];

        for (const i of body.reportes) { 
            try {
                
                const codigo = i.CODIGO?.toString() ?? null;
                if (codigo != null) {
                    if (codigo.split(".").length == 4) {    //Identifica q es una ACTIVIDAD
                                            
                        //Verificar si la META ya existe
                        let meta = await db.meta.findUnique({
                            where: { codigo: i.CODIGO?.toString() },
                        });
                        
                        if (!meta) {
                            meta = await db.meta.create({
                                data: {
                                    codigo: i.CODIGO_META?.toString(),
                                    meta: i.META?.toString(),
                                    idPresupuesto: idPresupuesto
                                },
                            }); 
                        }

                        //Verificar si la ACTIVIDAD ya existe
                        let actividad = await db.actividad.findUnique({
                            where: { codigo: i.CODIGO?.toString() },
                        });

                        if (!actividad) {
                            await db.actividad.create({
                                data: {
                                    codigo: i.CODIGO?.toString(),
                                    actividad: i.NOMBRE?.toString(),
                                    idMeta: meta.id,

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

                        //Identificar Gerencia
                        const gerencia = await db.gerencia.findFirst({
                            where: { siglas: i.GERENCIA?.trim().toUpperCase() }
                        });                        
                        
                        //Identificar Subgerencia
                        const subgerencia = await db.subgerencia.findFirst({
                            where: { siglas: i.GERENCIA?.trim().toUpperCase() }
                        });                        

                        await db.tarea.create({
                            data: {
                                codigo: i.CODIGO?.toString(),
                                tarea: i.NOMBRE?.toString(),
                                idGerencia: gerencia?.id,
                                idSubgerencia: subgerencia?.id,
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
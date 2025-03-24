import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface Reporte {
    GG?: string;
    UNIDAD_MEDIDA?: string;
    TAREA?: string;
    PROYECTO?: string;
    DESCRIPCION?: string;
    CLASIFICADOR?: string;
    CANTIDAD?: string;
    PRECIO?: string;
    ENE?: number;
    FEB?: number;
    MAR?: number;
    ABR?: number;
    MAY?: number;
    JUN?: number;
    JUL?: number;
    AGO?: number;
    SET?: number;
    OCT?: number;
    NOV?: number;
    DIC?: number;
    TOTAL?: string;
}

export async function POST(request: NextRequest) {
  try {
    const idPresupuesto = request.nextUrl.searchParams.get("idPresupuesto");
    const body = await request.json();

    if (!Array.isArray(body?.reportes)) {
      return NextResponse.json(
        { message: "El formato del archivo es incorrecto" },
        { status: 400 }
      );
    }    

    await Promise.all(body.reportes.map(async (reporte: Reporte) => {
      const [genericaGasto, unidadMedida, tarea, proyecto] = await Promise.all([
        db.genericaGasto.findFirst({ where: { value: reporte.GG }}),
        db.unidadMedida.findFirst({ where: { name: reporte.UNIDAD_MEDIDA }}),
        db.tarea.findFirst({ where: { tarea: reporte.TAREA }}),
        db.proyecto.findFirst({ where: { acronimo: reporte.PROYECTO }})
      ]);

      await db.servicio.create({
        data: {
          idPresupuesto,
          descripcion: reporte.DESCRIPCION?.toString() || "",
          idGenericaGasto: genericaGasto?.id,
          clasificador: reporte.CLASIFICADOR?.toString(),
          idUnidadMedida: unidadMedida?.id,
          idTarea: tarea?.id,
          idProyecto: proyecto?.id,
          cantidad: reporte.CANTIDAD?.toString() || "",
          precioUnitario: reporte.PRECIO?.toString() || "",
          ene: reporte.ENE ?? 0,
          feb: reporte.FEB ?? 0,
          mar: reporte.MAR ?? 0,
          abr: reporte.ABR ?? 0,
          may: reporte.MAY ?? 0,
          jun: reporte.JUN ?? 0,
          jul: reporte.JUL ?? 0,
          ago: reporte.AGO ?? 0,
          set: reporte.SET ?? 0,
          oct: reporte.OCT ?? 0,
          nov: reporte.NOV ?? 0,
          dic: reporte.DIC ?? 0,
          totalCosto: reporte.TOTAL?.toString() || "",
        },
      });
    }));

    return NextResponse.json(
      { message: "Datos registrados correctamente" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en la solicitud POST:", error);
    return NextResponse.json(
      { message: "Error interno del servidor, no se registraron los datos" },
      { status: 500 }
    );
  }
}

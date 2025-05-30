"use client";

import React, { useEffect, useState } from "react";
import { Presupuesto } from "@prisma/client";
import useSWR from "swr";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { IPlanificacion } from "@/interfaces/planificacion";
import CreatePlanificacion from "@/components/planificacion/create-planificacion";
import { IPlaniTarea } from "@/interfaces/tarea";
import UpdatePlaniTarea from "@/components/planificacion/update-planificacion-tarea";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Tareas() {
  const [value, setValue] = useState("");

  // Obtener presupuestos
  const { data: presupuestos } = useSWR<Presupuesto[]>("/api/presupuestos/active", fetcher);
  const presupuestoList = presupuestos || [];

  useEffect(() => {
    if (presupuestoList.length > 0 && !value) {
      setValue(presupuestoList[0].id);
    }
  }, [presupuestoList]);

  // Obtener planificación
  const { data: planificaciones, error, isLoading } = useSWR<IPlanificacion[]>(
    value ? `/api/planificacion/id?idPresupuesto=${value}` : "/api/planificacion",
    fetcher
  );
  const planificacionList = planificaciones || [];

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[600px] bg-white">
        <div className="relative w-12 h-12">
          <div className="absolute w-12 h-12 border-4 border-primary rounded-full animate-spin border-t-transparent"></div>
          <div className="absolute w-12 h-12 border-4 border-primary rounded-full animate-ping opacity-25"></div>
        </div>
      </div>
    );

  if (error) return <div>Ocurrió un error.</div>;

  // Agrupar actividades y tareas por meta
  const metasMap = planificacionList.reduce((acc, plan) => {
    if (!acc[plan.id_meta]) {
      acc[plan.id_meta] = { meta: plan.meta, actividades: {} };
    }

    if (!acc[plan.id_meta].actividades[plan.id_actividad]) {
      acc[plan.id_meta].actividades[plan.id_actividad] = {
        actividad: plan.actividad,
        tareas: [],
      };
    }

    if (plan.tarea) {
      acc[plan.id_meta].actividades[plan.id_actividad].tareas.push({
        idActividad: plan.id_actividad,
        idTarea: plan.id_tarea,
        codigo: plan.codigo_tarea,
        nombre: plan.tarea,
        idPresupuesto: value,
      });
    }

    return acc;
  }, {} as Record<string, { meta: string; actividades: Record<string, { actividad: string; tareas: IPlaniTarea[] }> }>);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-semibold text-gray-700">Planificación</h1>
        <CreatePlanificacion />
      </div>

      <div className="mb-4">
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger className="w-[300px] border border-gray-300 shadow-sm">
            <SelectValue placeholder="Seleccione presupuesto" />
          </SelectTrigger>
          <SelectContent>
            {presupuestoList.map((pre) => (
              <SelectItem key={pre.id} value={pre.id}>
                {pre.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {planificacionList.length > 0 ? (
        <Accordion type="multiple" className="w-full space-y-3">
          {Object.entries(metasMap).map(([id_meta, { meta, actividades }]) => (
            <AccordionItem key={id_meta} value={id_meta} className="border rounded-lg shadow-sm">
              <AccordionTrigger className="p-4 bg-blue-100 text-lg font-semibold rounded-t-lg transition-all hover:bg-blue-200">
                {meta}
              </AccordionTrigger>
              <AccordionContent className="bg-gray-50 p-4 rounded-b-lg">
                <Accordion type="multiple" className="space-y-2">
                  {Object.entries(actividades).map(([id_actividad, { actividad, tareas }]) => (
                    <AccordionItem key={id_actividad} value={id_actividad} className="border rounded-lg">
                      <AccordionTrigger className="p-3 bg-green-100 text-md font-medium rounded-t-lg transition-all hover:bg-green-200">
                        {actividad}
                      </AccordionTrigger>
                      <AccordionContent className="bg-white p-4 rounded-b-lg shadow-sm">
                        <div className="overflow-x-auto">
                          <table className="min-w-full border border-gray-300 shadow-md rounded-lg">
                            <thead>
                              <tr className="bg-gray-200 text-gray-700">
                                <th className="border px-4 py-2">Código</th>
                                <th className="border px-4 py-2">Tarea</th>
                                <th className="border px-4 py-2">Acciones</th>
                              </tr>
                            </thead>
                            <tbody>
                              {tareas.length > 0 ? (
                                tareas.map((tarea, index) => (
                                  <tr key={index} className="border-b bg-white hover:bg-gray-100">
                                    <td className="border px-4 py-2">{tarea.codigo}</td>
                                    <td className="border px-4 py-2">{tarea.nombre}</td>
                                    <td className="border px-4 py-2 text-center">
                                      <UpdatePlaniTarea planiTarea={tarea} />
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={3} className="border px-4 py-2 text-gray-500 text-center">
                                    Sin tareas
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="p-4 text-gray-500 text-center">No se encontraron registros</div>
      )}
    </div>
  );
}

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

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Tareas() {
  const [value, setValue] = useState("");

  // Obtener presupuestos
  const { data: presupuestos } = useSWR<Presupuesto[]>("/api/presupuestos/active", fetcher);
  const presupuestoList = presupuestos || [];

  useEffect(() => {
    if (presupuestoList.length > 0 && !value) {
      setValue(presupuestoList[0].id); // Establece el primer presupuesto automáticamente
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

  // Agrupar las actividades y tareas por meta
  const metasMap = planificacionList.reduce((acc, plan) => {
    if (!acc[plan.id_meta]) {
      acc[plan.id_meta] = { 
        meta: plan.meta, 
        actividades: {} 
      };
    }

    if (!acc[plan.id_meta].actividades[plan.id_actividad]) {
      acc[plan.id_meta].actividades[plan.id_actividad] = {
        actividad: plan.actividad,
        tareas: [],
      };
    }

    if (plan.tarea) {
      acc[plan.id_meta].actividades[plan.id_actividad].tareas.push(plan.codigo_tarea + " - " + plan.tarea);
    }

    return acc;
  }, {} as Record<string, { meta: string; actividades: Record<string, { actividad: string; tareas: string[] }> }>);

  return (
    <div className="bg-white p-4 py-6 rounded-md">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-medium">Planificación</h1>
        
        <CreatePlanificacion />
      </div>      

      <div className="mb-4">
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger className="w-[300px]">
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
        <Accordion type="multiple" className="w-full">
          {Object.entries(metasMap).map(([id_meta, { meta, actividades }]) => (
            <AccordionItem key={id_meta} value={id_meta}>
              <AccordionTrigger>{meta}</AccordionTrigger>
              <AccordionContent>
                <Accordion type="multiple">
                  {Object.entries(actividades).map(([id_actividad, { actividad, tareas }]) => (
                    <AccordionItem key={id_actividad} value={id_actividad}>
                      <AccordionTrigger>{actividad}</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-6">
                          {tareas.length > 0 ? (
                            tareas.map((tarea, index) => <li key={index}>{tarea}</li>)
                          ) : (
                            <li className="text-gray-500">Sin tareas</li>
                          )}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>    
      ) : (
        <div className="overflow-x-auto">
          <div className="px-4 py-2">No se encontraron registros</div>
        </div>        
      )}
      
    </div>
  );
}

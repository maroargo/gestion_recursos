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
      setValue(presupuestoList[0].id); // Establece el primer presupuesto automáticamente
    }
  }, [presupuestoList]);

  // Obtener programacion
  const { data: programaciones, error, isLoading } = useSWR<IPlanificacion[]>(
    value ? `/api/programacion/id?idPresupuesto=${value}` : "/api/programacion",
    fetcher
  );
  const programacionList = programaciones || [];

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

  
  return (
    <div className="bg-white p-4 py-6 rounded-md">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-medium">Programación</h1>
        
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

      
      
    </div>
  );
}

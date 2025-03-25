"use client";

import React, { useEffect, useState } from "react";
import { Role, Presupuesto, Actividad } from "@prisma/client";
import useSWR from "swr";
import CreateTarea from "@/components/tareas/create-tarea";
import UpdateTarea from "@/components/tareas/update-tarea";
import DeleteTarea from "@/components/tareas/delete-tarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ITarea } from "@/interfaces/tarea";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Tareas() {
  const [searchTerm, setSearchTerm] = useState("");
  const [presupuestoId, setPresupuestoId] = useState("");
  const [actividadId, setActividadId] = useState("");
 
  const { data: role } = useSWR<Role>("/api/roles/user", fetcher);
  const isAdmin = role?.name === "Administrador";

  const { data: presupuestos = [] } = useSWR<Presupuesto[]>("/api/presupuestos/active", fetcher);
  const { data: actividades = [] } = useSWR<Actividad[]>("/api/actividades/active", fetcher);

  useEffect(() => {
    if (presupuestos.length > 0 && !presupuestoId) {
      setPresupuestoId(presupuestos[0].id);
    }
  }, [presupuestos]);
  
  const { data: tareas = [], error, isLoading } = useSWR<ITarea[]>(
    presupuestoId ? `/api/tareas/id?idActividad=${actividadId}&idPresupuesto=${presupuestoId}` : "/api/tareas",
    fetcher
  );

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[600px] bg-white">
        <div className="w-12 h-12 border-4 border-primary rounded-full animate-spin border-t-transparent"></div>
      </div>
    );

  if (error) return <div>Ocurrió un error.</div>;
  
  const filteredTareas = tareas.filter((tarea) =>
    tarea.tarea.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentMonth = new Date().getMonth() + 1;
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "set", "oct", "nov", "dic"];
  
  return (
    <div className="bg-white p-6 rounded-md">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-semibold">Tareas</h1>
        {!isAdmin && <CreateTarea />}
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <Select value={presupuestoId} onValueChange={setPresupuestoId}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Seleccione presupuesto" />
          </SelectTrigger>
          <SelectContent>
            {presupuestos.map(({ id, nombre }) => (
              <SelectItem key={id} value={id}>{nombre}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={actividadId} onValueChange={setActividadId}>
          <SelectTrigger className="w-80">
            <SelectValue placeholder="Seleccione actividad" />
          </SelectTrigger>
          <SelectContent>
            {actividades.map(({ id, actividad }) => (
              <SelectItem key={id} value={id}>{actividad}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <input 
          type="text" 
          placeholder="Buscar tarea..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-64 border border-gray-300 rounded-md px-3 py-1"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Código</th>
              <th className="px-4 py-2 text-left">Tarea</th>
              <th className="px-4 py-2 text-left">Inicio</th>
              <th className="px-4 py-2 text-left">Fin</th>
              <th className="px-4 py-2 text-left w-64">Planificación</th>
              <th className="px-4 py-2 text-left">Servicios</th>
              <th className="px-4 py-2 text-left">Estado</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filteredTareas.length > 0 ? (
              filteredTareas.map((tarea) => (
                <tr key={tarea.id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-2">{tarea.codigo}</td>
                  <td className="px-4 py-2">{tarea.tarea}</td>
                  <td className="px-4 py-2">{tarea.inicio ? new Date(tarea.inicio).toLocaleDateString() : "No definido"}</td>
                  <td className="px-4 py-2">{tarea.fin ? new Date(tarea.fin).toLocaleDateString() : "No definido"}</td>
                  <td className="px-4 py-2 w-64 flex flex-wrap gap-1">
                    {meses.map((mes, index) =>
                      (tarea as Record<string, any>)[mes] !== 0 ? (
                        <span key={mes} className={`px-2 py-1 text-xs font-semibold rounded-md ${currentMonth === index + 1 ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}>{mes.toUpperCase()}</span>
                      ) : null
                    )}
                  </td>
                  <td className="px-4 py-2">{tarea.servicios?.length}</td>
                  <td className="px-4 py-2">{tarea.status}</td>
                  <td className="px-4 py-2 flex space-x-2">
                    <UpdateTarea tarea={tarea} />
                    {isAdmin && <DeleteTarea id={tarea.id} />}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-2 text-center">No se encontraron registros</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
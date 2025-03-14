"use client";

import React, {useEffect, useState} from 'react';

import {  Role, Presupuesto, Actividad } from '@prisma/client';
import useSWR from "swr";
import CreateTarea from '@/components/tareas/create-tarea';
import UpdateTarea from '@/components/tareas/update-tarea';
import DeleteTarea from '@/components/tareas/delete-tarea';
import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ITarea } from '@/interfaces/tarea';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Tareas() {
  const [searchTerm, setSearchTerm] = useState('');
  const [value, setValue] = React.useState("");
  const [valueA, setValueA] = React.useState("");
 
  const { data: role } = useSWR<Role>("/api/roles/user", fetcher);
  const isAdmin = role ? role.name == "Administrador" : false; 

  const { data: presupuestos } = useSWR<Presupuesto[]>(
    "/api/presupuestos/active",
    fetcher
  );
  const presupuestoList = presupuestos || [];

  const { data: actividades } = useSWR<Actividad[]>(
    "/api/actividades/active",
    fetcher
  );
  const actividadList = actividades || [];

  useEffect(() => {
      if (presupuestoList.length > 0 && !value) {
        setValue(presupuestoList[0].id); // Establece el primer presupuesto
      }
  }, [presupuestoList]);
  
  const {
    data: tareas,
    error,
    isLoading,
  } = useSWR<ITarea[]>(
    value ? `/api/tareas/id?idActividad=${valueA}&idPresupuesto=${value}` : "/api/tareas",
    fetcher
  );  
  const tareaList = tareas || [];

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
  
  const filteredData = tareaList.filter(item => 
    item.tarea.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentMonth = new Date().getMonth() + 1; // Obtener el mes actual (1 = Enero, 2 = Febrero, ..., 3 = Marzo)

  return (
    <>
      <div className="bg-white p-4 py-6 rounded-md">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-xl font-medium">Tareas</h1>
          
          {!isAdmin && (
            <CreateTarea />
          )}
        </div>

        <div className="flex justify-between items-center ">
          <div className="flex justify-between items-center mb-4">
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

          <div className="flex justify-between items-center mb-4">
            <Select value={valueA} onValueChange={setValueA}>
              <SelectTrigger className="w-[500px]">
                <SelectValue placeholder="Seleccione actividad" />
              </SelectTrigger>
              <SelectContent>
                {actividadList.map((act) => (
                  <SelectItem key={act.id} value={act.id}>
                    {act.actividad}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>    
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <input 
              type="text" 
              placeholder="Buscar por tarea..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[300px] border border-colorprimario1 rounded-md  px-3 py-1"
            />
          </div>          
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse text-sm">
            <thead className="bg-colorprimario1 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Código</th>
                <th className="px-4 py-2 text-left">Tarea</th>
                <th className="px-4 py-2 text-left">Inicio</th>
                <th className="px-4 py-2 text-left">Fin</th>                
                <th className="px-4 py-2 text-left w-[200px]">Planificación</th>
                <th className="px-4 py-2 text-left">Estado</th>
                <th className="px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredData.length > 0 ? (
                filteredData.map((tarea) => (
                  <tr
                    key={tarea.id}
                    className="hover:bg-gray-50 border-b border-[#D3D3D3] "
                  >
                    <td className="px-4 py-2">{tarea.codigo}</td>
                    <td className="px-4 py-2">{tarea.tarea}</td>
                    <td className="px-4 py-2">{tarea.inicio ? new Date(tarea.inicio).toLocaleDateString() : "No definido"}</td>
                    <td className="px-4 py-2">{tarea.fin ? new Date(tarea.fin).toLocaleDateString() : "No definido"}</td>
                    <td className="px-4 py-2 w-[200px]">
                      {tarea.ene !== 0 && (
                        <Badge variant={currentMonth === 1 ? "destructive" : "default"}>{"Ene"}</Badge>
                      )}                      
                      {tarea.feb !== 0 && (
                        <Badge variant={currentMonth === 2 ? "destructive" : "default"}>{"Feb"}</Badge>
                      )}                     
                      {tarea.mar !== 0 && (
                        <Badge variant={currentMonth === 3 ? "destructive" : "default"}>{"Mar"}</Badge>
                      )}
                      {tarea.abr !== 0 && (
                        <Badge variant={currentMonth === 4 ? "destructive" : "default"}>{"Abr"}</Badge>
                      )}
                      {tarea.may !== 0 && (
                        <Badge variant={currentMonth === 5 ? "destructive" : "default"}>{"May"}</Badge>
                      )}
                      {tarea.jun !== 0 && (
                        <Badge variant={currentMonth === 6 ? "destructive" : "default"}>{"Jun"}</Badge>
                      )}
                      {tarea.jul !== 0 && (
                        <Badge variant={currentMonth === 7 ? "destructive" : "default"}>{"Jul"}</Badge>
                      )}
                      {tarea.ago !== 0 && (
                        <Badge variant={currentMonth === 8 ? "destructive" : "default"}>{"Ago"}</Badge>
                      )}
                      {tarea.set !== 0 && (
                        <Badge variant={currentMonth === 9 ? "destructive" : "default"}>{"Set"}</Badge>
                      )}
                      {tarea.oct !== 0 && (
                        <Badge variant={currentMonth === 10 ? "destructive" : "default"}>{"Oct"}</Badge>
                      )}
                      {tarea.nov !== 0 && (
                        <Badge variant={currentMonth === 11 ? "destructive" : "default"}>{"Nov"}</Badge>
                      )}
                      {tarea.dic !== 0 && (
                        <Badge variant={currentMonth === 12 ? "destructive" : "default"}>{"Dic"}</Badge>
                      )}
                    </td>
                    <td className="px-4 py-2">{tarea.status}</td>
                    <td className="px-4 py-2">
                      <UpdateTarea tarea={tarea} />
                      {isAdmin && (
                        <DeleteTarea id={tarea.id} />                        
                      )}                                            
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-2">No se encontraron registros</td>
                </tr>
              )}
              
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

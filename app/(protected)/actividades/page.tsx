"use client";

import React, {useEffect, useState} from 'react';

import CreateActividad from '@/components/actividades/create-actividad';
import UpdateActividad from '@/components/actividades/update-actividad';
import DeleteActividad from '@/components/actividades/delete-actividad';
import { Actividad, Presupuesto, Role } from '@prisma/client';
import useSWR from "swr";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Actividads() {
  const [searchTerm, setSearchTerm] = useState('');
  const [value, setValue] = React.useState("");
 
  const { data: role } = useSWR<Role>("/api/roles/user", fetcher);
  const isAdmin = role ? role.name == "Administrador" : false; 

  const { data: presupuestos } = useSWR<Presupuesto[]>(
    "/api/presupuestos/active",
    fetcher
  );
  const presupuestoList = presupuestos || [];

  useEffect(() => {
      if (presupuestoList.length > 0 && !value) {
        setValue(presupuestoList[0].id); // Establece el primer presupuesto
      }
  }, [presupuestoList]);

  const {
    data: actividads,
    error,
    isLoading,
  } = useSWR<Actividad[]>(
    value ? `/api/actividades/id?idPresupuesto=${value}` : "/api/actividades",
    fetcher    
  );   
  const actividadList = actividads || [];   

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
  
  const filteredData = actividadList.filter(item => 
    item.actividad.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="bg-white p-4 py-6 rounded-md">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-xl font-medium">Actividades</h1>
          
          {!isAdmin && (
            <CreateActividad />
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
            <input 
              type="text" 
              placeholder="Buscar por actividad..."
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
                <th className="px-4 py-2 text-left">Actividad Operativa</th>
                <th className="px-4 py-2 text-left">Estado</th>
                <th className="px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredData.length > 0 ? (
                filteredData.map((actividad) => (
                  <tr
                    key={actividad.id}
                    className="hover:bg-gray-50 border-b border-[#D3D3D3] "
                  >
                    <td className="px-4 py-2">{actividad.codigo}</td>
                    <td className="px-4 py-2">{actividad.actividad}</td>
                    <td className="px-4 py-2">{actividad.status}</td>
                    <td className="px-4 py-2">
                      <UpdateActividad actividad={actividad} />
                      {isAdmin && (
                        <DeleteActividad id={actividad.id} />                        
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

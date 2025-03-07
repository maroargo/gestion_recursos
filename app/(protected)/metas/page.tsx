"use client";

import React, {useEffect, useState} from 'react';

import CreateMeta from '@/components/metas/create-meta';
import UpdateMeta from '@/components/metas/update-meta';
import DeleteMeta from '@/components/metas/delete-meta';
import { Presupuesto, Role } from '@prisma/client';
import useSWR from "swr";
import { IMeta } from '@/interfaces/meta';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Metas() {
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

  const { data: metas, 
    error, 
    isLoading 
  } = useSWR<IMeta[]>(
    value ? `/api/metas/id?idPresupuesto=${value}` : "/api/metas",
    fetcher
  );
  const metaList = metas || [];
   
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
    
  const filteredData = metaList.filter(item => 
    item.meta.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <>
      <div className="bg-white p-4 py-6 rounded-md">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-xl font-medium">Metas</h1>
          
          {!isAdmin && (
            <CreateMeta />
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
              placeholder="Buscar por meta..."
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
              <th className="px-4 py-2 text-left">Presupuesto</th>
                <th className="px-4 py-2 text-left">Código</th>
                <th className="px-4 py-2 text-left">Meta</th>
                <th className="px-4 py-2 text-left">Estado</th>
                <th className="px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredData.length > 0 ? (
                filteredData.map((meta) => (
                  <tr
                    key={meta.id}
                    className="hover:bg-gray-50 border-b border-[#D3D3D3] "
                  >
                    <td className="px-4 py-2">{meta.presupuesto.nombre}</td>
                    <td className="px-4 py-2">{meta.codigo}</td>
                    <td className="px-4 py-2">{meta.meta}</td>
                    <td className="px-4 py-2">{meta.status}</td>
                    <td className="px-4 py-2">
                      <UpdateMeta meta={meta} />
                      {isAdmin && (
                        <DeleteMeta id={meta.id} />                        
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

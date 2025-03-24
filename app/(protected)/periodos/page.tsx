"use client";

import React, {useState} from 'react';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { Role } from '@prisma/client';
import useSWR from "swr";
import CreatePeriodo from '@/components/periodos/create-periodo';
import UpdatePeriodo from '@/components/periodos/update-periodo';
import DeletePeriodo from '@/components/periodos/delete-periodo';
import { IPeriodo } from '@/interfaces/periodo';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Periodos() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const {
    data: periodos,
    error,
    isLoading,
  } = useSWR<IPeriodo[]>("/api/periodos", fetcher);  

  const { data: role } = useSWR<Role>("/api/roles/user", fetcher);
  const isAdmin = role ? role.name == "Administrador" : false;  

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

  const periodoList = periodos || [];

  const filteredData = periodoList.filter(item => 
    item.periodo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="bg-white p-4 py-6 rounded-md">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-xl font-medium">Presupuestos</h1>
          
          {!isAdmin && (
            <CreatePeriodo />
          )}
        </div>

        <div className="flex justify-between items-center ">
          <div className="flex justify-between items-center mb-4">
            <label className="text-sm text-gray-600">
              <span className="pr-1">Mostrar</span>

              <select className="border border-gray-300 rounded px-2 py-1">
                <option>10</option>
                <option>25</option>
                <option>50</option>
                <option>100</option>
              </select>
              <span className="pl-1">registros</span>
            </label>  
          </div>
          
          <input 
            type="text" 
            placeholder="Buscar por periodo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-colorprimario1 rounded-md px-3 py-1"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse text-sm">
            <thead className="bg-colorprimario1 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Período</th>                
                <th className="px-4 py-2 text-left">Valor UIT</th>
                <th className="px-4 py-2 text-left">Presupuestos</th>
                <th className="px-4 py-2 text-left">Estado Periodo</th>
                <th className="px-4 py-2 text-left">Estado</th>
                <th className="px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredData.length > 0 ? (
                filteredData.map((periodo) => (
                  <tr
                    key={periodo.id}
                    className="hover:bg-gray-50 border-b border-[#D3D3D3] "
                  >                    
                    <td className="px-4 py-2"><b>{periodo.periodo}</b> <br /> {periodo.descripcion}</td>      
                    <td className="px-4 py-2">{periodo.uit}</td>                    
                    <td className="px-4 py-2 flex flex-wrap gap-2">
                      {periodo.presupuestos.map((det) => (
                        <HoverCard key={det.id}>
                          <HoverCardTrigger className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md cursor-pointer hover:bg-gray-300">
                            {det.nombre}
                          </HoverCardTrigger>
                          <HoverCardContent className="p-4 bg-white shadow-lg rounded-lg">
                            <div className="text-sm font-medium text-gray-900">Procesos Electorales: {det.procesos.length}</div>
                            {det.procesos.length > 0 && (
                              <ul className="mt-2 text-sm text-gray-700">
                                {det.procesos.map((pro) => (
                                  <li key={pro.id} className="list-disc ml-4">{pro.name}</li>
                                ))}
                              </ul>
                            )}                                                           
                          </HoverCardContent>
                        </HoverCard>
                      ))}
                    </td>
                    <td className="px-4 py-2">
                      {periodo.statusPeriodo === "vigente" && (
                        <span className="px-3 py-1 text-white bg-red-500 rounded-md">Vigente</span>
                      )}
                      {periodo.statusPeriodo === "no_vigente" && (
                        <span>No Vigente</span>
                      )}                
                    </td>
                    <td className="px-4 py-2">{periodo.status}</td>
                    <td className="px-4 py-2 flex space-x-2">
                      <UpdatePeriodo periodo={periodo} />
                      {isAdmin && (
                        <DeletePeriodo id={periodo.id} />                        
                      )}                                            
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-2" colSpan={6}>No se encontraron registros</td>
                </tr>
              )}
              
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

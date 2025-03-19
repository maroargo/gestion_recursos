"use client";

import React, {useEffect, useState} from 'react';

import CreateProyecto from '@/components/proyectos/create-proyecto';
import UpdateProyecto from '@/components/proyectos/update-proyecto';
import DeleteProyecto from '@/components/proyectos/delete-proyecto';
import { Role } from '@prisma/client';
import useSWR from "swr";
import { IProyecto } from '@/interfaces/proyecto';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Proyectos() {
  const [searchTerm, setSearchTerm] = useState('');  
 
  const { data: role } = useSWR<Role>("/api/roles/user", fetcher);
  const isAdmin = role ? role.name == "Administrador" : false;   

  const {
    data: proyectos,
    error,
    isLoading,
  } = useSWR<IProyecto[]>(
    "/api/proyectos",
    fetcher    
  );   
  const proyectoList = proyectos || [];   

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
  
  const filteredData = proyectoList.filter(item => 
    item.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="bg-white p-4 py-6 rounded-md">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-xl font-medium">Proyectos</h1>
          
          {!isAdmin && (
            <CreateProyecto />
          )}
        </div>

        <div className="flex justify-between items-center ">
          <div className="flex justify-between items-center mb-4">
             
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <input 
              type="text" 
              placeholder="Buscar por nombre..."
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
                <th className="px-4 py-2 text-left">Proyecto</th>
                <th className="px-4 py-2 text-left">Acrónimo</th>
                <th className="px-4 py-2 text-left">Periodo</th>
                <th className="px-4 py-2 text-left">Estado</th>
                <th className="px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredData.length > 0 ? (
                filteredData.map((proyecto) => (
                  <tr
                    key={proyecto.id}
                    className="hover:bg-gray-50 border-b border-[#D3D3D3] "
                  >
                    <td className="px-4 py-2">{proyecto.nombre}</td>
                    <td className="px-4 py-2">{proyecto.acronimo}</td>                                        
                    <td className="px-4 py-2">{proyecto.periodo.nombre}</td>
                    <td className="px-4 py-2">{proyecto.status}</td>
                    <td className="px-4 py-2">
                      <UpdateProyecto proyecto={proyecto} />
                      {isAdmin && (
                        <DeleteProyecto id={proyecto.id} />                        
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

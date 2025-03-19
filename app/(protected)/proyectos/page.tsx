"use client";

import React, { useState } from 'react';
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
  } = useSWR<IProyecto[]>("/api/proyectos", fetcher);   
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
    <div className="bg-white p-6 rounded-md">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-medium">Proyectos</h1>
        {!isAdmin && <CreateProyecto />}
      </div>

      <div className="mb-4">
        <input 
          type="text" 
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.length > 0 ? (
          filteredData.map((proyecto) => (
            <div key={proyecto.id} className="border rounded-lg shadow-md p-4 bg-gray-50">
              <h2 className="text-sm font-semibold text-gray-800 truncate">{proyecto.nombre}</h2>
              <p className="text-sm text-gray-600">Acrónimo: {proyecto.acronimo}</p>
              <p className="text-sm font-bold text-blue-600">Periodo: {proyecto.periodo.periodo}</p>
              <p className="text-sm text-gray-600">Estado: {proyecto.status}</p>
              <div className="mt-3 flex space-x-2">
                <UpdateProyecto proyecto={proyecto} />
                <DeleteProyecto id={proyecto.id} />
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No se encontraron registros</p>
        )}
      </div>
    </div>
  );
}
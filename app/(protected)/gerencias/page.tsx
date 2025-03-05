"use client";

import React, {useState} from 'react';

import CreateGerencia from "@/components/gerencias/create-gerencia";
import DeleteGerencia from "@/components/gerencias/delete-gerencia";
import UpdateGerencia from "@/components/gerencias/update-gerencia";
import { Role } from '@prisma/client';
import useSWR from "swr";
import { IGerencia } from '@/interfaces/gerencia';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Gerencias() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const {
    data: gerencias,
    error,
    isLoading,
  } = useSWR<IGerencia[]>("/api/gerencias", fetcher);  

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

  const gerenciaList = gerencias || [];

  const filteredData = gerenciaList.filter(item => 
    item.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="bg-white p-4 py-6 rounded-md">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-xl font-medium">Gerencias</h1>
          
          {isAdmin && (
            <CreateGerencia />
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
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-colorprimario1 rounded-md  px-3 py-1"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse text-sm">
            <thead className="bg-colorprimario1 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Nombre</th>
                <th className="px-4 py-2 text-left">Siglas</th>
                <th className="px-4 py-2 text-left">Titular</th>                
                <th className="px-4 py-2 text-left">Organización</th>
                <th className="px-4 py-2 text-left">Estado</th>
                <th className="px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredData.length > 0 ? (
                filteredData.map((ge) => (
                  <tr
                    key={ge.id}
                    className="hover:bg-gray-50 border-b border-[#D3D3D3] "
                  >
                    <td className="px-4 py-2">{ge.nombre}</td>
                    <td className="px-4 py-2">{ge.siglas}</td>
                    <td className="px-4 py-2">{ge.titular}</td>  
                    <td className="px-4 py-2">{ge.organization.name}</td>              
                    <td className="px-4 py-2">{ge.status}</td>
                    <td className="px-4 py-2">
                      <UpdateGerencia gerencia={ge} />
                      {isAdmin && (
                        <DeleteGerencia id={ge.id} />                        
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

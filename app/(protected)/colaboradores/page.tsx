"use client";

import React, {useEffect, useState} from 'react';

import CreateColaborador from '@/components/colaboradores/create-colaborador';
import UpdateColaborador from '@/components/colaboradores/update-colaborador';
import DeleteColaborador from '@/components/colaboradores/delete-colaborador';
import { Colaborador, Presupuesto, Role } from '@prisma/client';
import useSWR from "swr";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IColaborador } from '@/interfaces/colaborador';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Colaboradors() {
  const [searchTerm, setSearchTerm] = useState('');
  const [value, setValue] = React.useState("");
 
  const { data: role } = useSWR<Role>("/api/roles/user", fetcher);
  const isAdmin = role ? role.name == "Administrador" : false;   

  const {
    data: colaboradores,
    error,
    isLoading,
  } = useSWR<IColaborador[]>(
    "/api/colaboradores",
    fetcher    
  );   
  const colaboradorList = colaboradores || [];   

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
  
  const filteredData = colaboradorList.filter(item => 
    item.nombres.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="bg-white p-4 py-6 rounded-md">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-xl font-medium">Colaboradores</h1>
          
          {!isAdmin && (
            <CreateColaborador />
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
                <th className="px-4 py-2 text-left">Nombres</th>
                <th className="px-4 py-2 text-left">DNI / RUC</th>
                <th className="px-4 py-2 text-left">Correo</th>
                <th className="px-4 py-2 text-left">Celular</th>
                <th className="px-4 py-2 text-left">Perfil Académico</th>
                <th className="px-4 py-2 text-left">Estado</th>
                <th className="px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredData.length > 0 ? (
                filteredData.map((colaborador) => (
                  <tr
                    key={colaborador.id}
                    className="hover:bg-gray-50 border-b border-[#D3D3D3] "
                  >
                    <td className="px-4 py-2">{colaborador.nombres} {colaborador.paterno} {colaborador.materno}</td>
                    <td className="px-4 py-2">DNI: {colaborador.dni} <br /> RUC: {colaborador.ruc}</td>
                    <td className="px-4 py-2">{colaborador.correo}</td>
                    <td className="px-4 py-2">{colaborador.celular}</td>
                    <td className="px-4 py-2">{colaborador.perfilAcademico.cargo}</td>
                    <td className="px-4 py-2">{colaborador.status}</td>
                    <td className="px-4 py-2">
                      <UpdateColaborador colaborador={colaborador} />
                      {isAdmin && (
                        <DeleteColaborador id={colaborador.id} />                        
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

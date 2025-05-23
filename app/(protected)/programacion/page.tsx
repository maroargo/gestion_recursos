"use client";

import React, {useState} from 'react';

import { Periodo, Role } from '@prisma/client';
import useSWR from "swr";
import CreateServicio from '@/components/servicios/create-servicio';
import UpdateServicio from '@/components/servicios/update-servicio';
import DeleteServicio from '@/components/servicios/delete-servicio';
import { IServicio } from '@/interfaces/servicio';
import CreateProgramacion from '@/components/servicios/create-programacion';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Servicios() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const {
    data: servicios,
    error,
    isLoading,
  } = useSWR<IServicio[]>("/api/servicios", fetcher);  

  const { data: role } = useSWR<Role>("/api/roles/user", fetcher);
  const isAdmin = role ? role.name == "Administrador" : false;  

  const { data: periodo } = useSWR<Periodo>("/api/periodos/active", fetcher);

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

  const servicioList = servicios || [];

  const filteredData = servicioList.filter(item => 
    item.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="bg-white p-4 py-6 rounded-md">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-xl font-medium">Programación</h1>
          <div className="flex gap-3">
            
            <CreateServicio />
            <CreateProgramacion />            
          </div>
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
            placeholder="Buscar por servicio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-colorprimario1 rounded-md px-3 py-1"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse text-sm">
            <thead className="bg-colorprimario1 text-white">
              <tr>
              <th className="px-4 py-2 text-left">Presupuesto</th>
              <th className="px-4 py-2 text-left">Cant.</th> 
                <th className="px-4 py-2 text-left">Descripción</th>                
                <th className="px-4 py-2 text-left">Clasificador</th> 
                <th className="px-4 py-2 text-left">Total</th>  
                <th className="px-4 py-2 text-left">Unid. Medida</th>                
                <th className="px-4 py-2 text-left">Tarea</th>   
                <th className="px-4 py-2 text-left">Estado</th>
                <th className="px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredData.length > 0 ? (
                filteredData.map((servicio) => (
                  <tr
                    key={servicio.id}
                    className="hover:bg-gray-50 border-b border-[#D3D3D3] "
                  >                    
                    <td className="px-4 py-2">{servicio.presupuesto?.nombre} <br/> <b>{servicio.proyecto?.acronimo}</b></td> 
                    <td className="px-4 py-2">{servicio.cantidad}</td> 
                    <td className="px-4 py-2">{servicio.descripcion}</td>       
                    <td className="px-4 py-2">{servicio.clasificador}</td>                                         
                    <td
                      className={`px-4 py-2 ${
                        periodo && Number(servicio.totalCosto) > Number(periodo?.uit) * 5
                          ? "text-red-500 font-bold"
                          : ""
                      }`}
                    >
                      {new Intl.NumberFormat("es-PE", {
                        style: "currency",
                        currency: "PEN",
                      }).format(Number(servicio.totalCosto) || 0)}
                    </td>
                    <td className="px-4 py-2">{servicio.unidadMedida?.name}</td>                                                           
                    <td className="px-4 py-2 flex items-center">
                      {servicio.tarea?.tarea ? (
                        <div className="relative group">
                          <span className="w-3 h-3 bg-green-500 rounded-full inline-block mr-2 cursor-pointer"></span>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                            {servicio.tarea.tarea}
                          </div>
                        </div>
                      ) : (
                        <span className="w-3 h-3 bg-red-500 rounded-full inline-block"></span>
                      )}
                    </td>

                    <td className="px-4 py-2">{servicio.status}</td>
                    <td className="px-4 py-2 flex space-x-2">
                      <UpdateServicio servicio={servicio} />
                      <DeleteServicio id={servicio.id} />                                             
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

"use client";

import React, { useState } from "react";
import useSWR from "swr";

import CreateUser from "@/components/users/create-user";
import DeleteUser from "@/components/users/delete-user";
import UpdateUser from "@/components/users/update-user";
import { IUser } from "@/interfaces/user";
import { Role } from "@prisma/client";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: users,
    error,
    isLoading,
  } = useSWR<IUser[]>("/api/users", fetcher);

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

  const userList = users || [];

  const filteredData = userList.filter((item) =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="bg-white p-4 py-6 rounded-md">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-xl font-medium">Usuarios</h1>
          {(isAdmin) && (
            <CreateUser />                  
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
            placeholder="Buscar..."
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
                <th className="px-4 py-2 text-left">Correo</th>
                <th className="px-4 py-2 text-left">Celular</th>                               
                <th className="px-4 py-2 text-left">Organización</th>
                <th className="px-4 py-2 text-left">Gerencia</th>
                <th className="px-4 py-2 text-left">Rol</th>
                <th className="px-4 py-2 text-left">Estado</th>
                {(isAdmin) && (
                  <th className="px-4 py-2 text-left">Acciones</th>                    
                )}                
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredData.length > 0 ? (
                filteredData.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 border-b border-[#D3D3D3] "
                  >
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.phone}</td>                    
                    <td className="px-4 py-2">{user.subgerencia?.gerencia.organization.name}</td>
                    <td className="px-4 py-2">{user.subgerencia?.gerencia.nombre} {user.subgerencia?.siglas}</td>
                    <td className="px-4 py-2">{user.role?.name}</td> 
                    <td className="px-4 py-2">{user.status}</td>                    
                    {(isAdmin) && (
                      <td className="px-4 py-2">
                        <UpdateUser user={user} /> 
                        <DeleteUser id={user.id} />                                        
                      </td>                   
                    )}                                        
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

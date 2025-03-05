"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useSWR from "swr";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

import { userSchema, type UserSchema } from "@/lib/zod";
import { Gerencia, Organization, Role, Subgerencia } from "@prisma/client";
import { useEffect, useState } from "react";

interface UserFormProps {
  defaultValues: UserSchema;
  onSubmit: (data: UserSchema) => Promise<void>;
  submitButtonText: string;
  isSubmitting: boolean;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function UserForm({
  defaultValues,
  onSubmit,
  submitButtonText,
  isSubmitting,
}: UserFormProps) {
  const form = useForm<UserSchema>({
    resolver: zodResolver(userSchema),
    defaultValues,
  }); 
  
  const [gerenciaList, setGerenciaList] = useState<Gerencia[]>([]);
  const [subgerenciaList, setSubgerenciaList] = useState<Subgerencia[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [selectedGerencia, setSelectedGerencia] = useState("");

  const { data: organizations } = useSWR<Organization[]>(
    "/api/organizations/active",
    fetcher
  );
  const organizationList = organizations || [];
  const { data: roles } = useSWR<Role[]>("/api/roles/active", fetcher);  
  const roleList = roles || [];  
  
  // useEffect para cargar gerencias cuando se selecciona una organización
  useEffect(() => {       
    if (selectedOrganization) {      
      const fetchGerencias = async () => {
        const response = await fetch(
          `/api/gerencias/organization?idOrganization=${selectedOrganization}`
        );
        const gerenciasData: Gerencia[] = await response.json();
        setGerenciaList(gerenciasData || []);
        setSubgerenciaList([]);
      };

      fetchGerencias();
    }
  }, [selectedOrganization]); // Este efecto se ejecuta cuando cambia la organización seleccionada

  // useEffect para cargar subgerencias cuando se selecciona una gerencia
  useEffect(() => {
    if (selectedGerencia) {      
      const fetchSubgerencias = async () => {
        const response = await fetch(
          `/api/subgerencias/gerencia?idGerencia=${selectedGerencia}`
        );
        const subgerenciasData: Subgerencia[] = await response.json();
        setSubgerenciaList(subgerenciasData || []);        
      };

      fetchSubgerencias();
    }
  }, [selectedGerencia]); // Este efecto se ejecuta cuando cambia la gerencia seleccionada
      
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombres</FormLabel>
              <FormControl>
                <Input placeholder="Nombres" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo</FormLabel>
                <FormControl>
                  <Input placeholder="Correo" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Celular</FormLabel>
                <FormControl>
                  <Input placeholder="Celular" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input placeholder="Contraseña" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="idOrganization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organización</FormLabel>
                <Select onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedOrganization(value);  // Actualizamos la organización seleccionada
                }} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {organizationList.map((organization) => (
                    <SelectItem key={organization.id} value={organization.id}>
                      {organization.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="idGerencia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gerencia</FormLabel>
                <Select onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedGerencia(value);  // Actualizamos la gerencia seleccionada
                }} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {gerenciaList.map((ger) => (
                      <SelectItem key={ger.id} value={ger.id}>
                        {ger.siglas}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="idSubgerencia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sub Gerencia</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subgerenciaList.map((sger) => (
                      <SelectItem key={sger.id} value={sger.id}>
                        {sger.siglas}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="idRole"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rol</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {roleList.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          disabled={isSubmitting}
          className="w-full relative"
          type="submit"
        >
          {isSubmitting && (
            <div className="absolute inset-0 flex items-center justify-center bg-primary/50 rounded-md">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          {submitButtonText}
        </Button>
      </form>
    </Form>
  );
}

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

import { colaboradorSchema, type ColaboradorSchema } from "@/lib/zod";
import { IStatus } from "@/interfaces/status";
import { Meta, PerfilAcademico } from "@prisma/client";

interface ColaboradorFormProps {
  defaultValues: ColaboradorSchema;
  onSubmit: (data: ColaboradorSchema) => Promise<void>;
  submitButtonText: string;
  isSubmitting: boolean;
  isUpdating: boolean;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ColaboradorForm({
  defaultValues,
  onSubmit,
  submitButtonText,
  isSubmitting,
  isUpdating,
}: ColaboradorFormProps) {
  const form = useForm<ColaboradorSchema>({
    resolver: zodResolver(colaboradorSchema),
    defaultValues,
  });

  const statusList: IStatus[] = [
    { id: "0", name: "Activo" },
    { id: "1", name: "Inactivo" },
  ];

  const { data: perfiles } = useSWR<PerfilAcademico[]>("/api/perfilAcademicos/active", fetcher);
  const perfilList = perfiles || [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="dni"
            render={({ field }) => (
              <FormItem>
                <FormLabel>DNI</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> 
          <FormField
            control={form.control}
            name="ruc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>RUC</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />  
        </div>

        <FormField
          control={form.control}
          name="nombres"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombres</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="paterno"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido Paterno</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> 
          <FormField
            control={form.control}
            name="materno"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido Materno</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />  
        </div>

        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="correo"
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
            name="celular"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Celular</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />  
        </div>        

        <FormField
          control={form.control}
          name="idPerfilAcademico"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Perfil Académico</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione perfil" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {perfilList.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.cargo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        /> 

        {isUpdating && (
          <FormField
            control={form.control}
            name="idStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {statusList.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}        

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

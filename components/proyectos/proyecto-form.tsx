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

import { proyectoSchema, type ProyectoSchema } from "@/lib/zod";
import { IStatus } from "@/interfaces/status";
import { Periodo } from "@prisma/client";

interface ProyectoFormProps {
  defaultValues: ProyectoSchema;
  onSubmit: (data: ProyectoSchema) => Promise<void>;
  submitButtonText: string;
  isSubmitting: boolean;
  isUpdating: boolean;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ProyectoForm({
  defaultValues,
  onSubmit,
  submitButtonText,
  isSubmitting,
  isUpdating,
}: ProyectoFormProps) {
  const form = useForm<ProyectoSchema>({
    resolver: zodResolver(proyectoSchema),
    defaultValues,
  });

  const statusList: IStatus[] = [
    { id: "0", name: "Activo" },
    { id: "1", name: "Inactivo" },
  ];

  const { data: periodos } = useSWR<Periodo[]>("/api/periodos/active", fetcher);
  const periodoList = periodos || [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="acronimo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Acrónimo</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />     

        <FormField
          control={form.control}
          name="idPeriodo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Periodo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione periodo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {periodoList.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.descripcion}
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

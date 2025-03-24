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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

import { servicioSchema, type ServicioSchema } from "@/lib/zod";
import { IStatus } from "@/interfaces/status";
import {
  GenericaGasto,
  Gerencia,
  Meta,
  UnidadMedida,
} from "@prisma/client";

interface ServicioFormProps {
  defaultValues: ServicioSchema;
  onSubmit: (data: ServicioSchema) => Promise<void>;
  submitButtonText: string;
  isSubmitting: boolean;
  isUpdating: boolean;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ServicioForm({
  defaultValues,
  onSubmit,
  submitButtonText,
  isSubmitting,
  isUpdating,
}: ServicioFormProps) {
  const form = useForm<ServicioSchema>({
    resolver: zodResolver(servicioSchema),
    defaultValues,
  });

  const { data: gerencias } = useSWR<Gerencia[]>(
    "/api/gerencias/active",
    fetcher
  );
  
  const statusList: IStatus[] = [
    { id: "0", name: "Activo" },
    { id: "1", name: "Inactivo" },
  ];

  const { data: metas } = useSWR<Meta[]>("/api/metas/active", fetcher);
  const metaList = metas || [];
 
  const { data: gastos } = useSWR<GenericaGasto[]>(
    "/api/genericaGastos",
    fetcher
  );
  const gastoList = gastos || [];
  const { data: medidas } = useSWR<UnidadMedida[]>(
    "/api/unidadMedidas",
    fetcher
  );
  const medidaList = medidas || [];  

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="descripcion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bien o Servicio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Bien o Servicio"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />                

        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="idGenericaGasto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gasto</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione gasto" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {gastoList.map((gasto) => (
                      <SelectItem key={gasto.id} value={gasto.id}>
                        {gasto.value} - {gasto.name}
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
            name="clasificador"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Clasificador</FormLabel>
                <FormControl>
                  <Input placeholder="Clasificador" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="cantidad"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cantidad</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Cantidad"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="precioUnitario"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio Unitario</FormLabel>
                <FormControl>
                  <Input placeholder="Precio Unitario" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="idUnidadMedida"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unidad de Medida</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione medida" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {medidaList.map((medida) => (
                      <SelectItem key={medida.id} value={medida.id}>
                        {medida.name}
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
        </div>

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

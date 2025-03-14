"use client";

import { useFieldArray, useForm } from "react-hook-form";
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
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

import { periodoSchema, type PeriodoSchema } from "@/lib/zod";
import { IStatus, IStatusPeriodo } from "@/interfaces/status";
import { CirclePlus, Trash2 } from "lucide-react";
import { TipoPresupuesto } from "@prisma/client";

interface PeriodoFormProps {
  defaultValues: PeriodoSchema;
  onSubmit: (data: PeriodoSchema) => Promise<void>;
  submitButtonText: string;
  isSubmitting: boolean;
  isUpdating: boolean;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function PeriodoForm({
  defaultValues,
  onSubmit,
  submitButtonText,
  isSubmitting,
  isUpdating,
}: PeriodoFormProps) {
  const form = useForm<PeriodoSchema>({
    resolver: zodResolver(periodoSchema),
    defaultValues,
  });

  const { fields, append, remove, update } = useFieldArray({
    name: "presupuestos",
    control: form.control,
  });

  const statusList: IStatus[] = [
    { id: "0", name: "Activo" },
    { id: "1", name: "Inactivo" },
  ];

  const statusPeriodoList: IStatusPeriodo[] = [
    { id: "0", name: "Vigente" },
    { id: "1", name: "No vigente" },
  ];

  const { data: tipoPresupuestos } = useSWR<TipoPresupuesto[]>(
    "/api/tipoPresupuestos",
    fetcher
  );
  const tipoPresupuestoList = tipoPresupuestos || [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="periodo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Período</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="descripcion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
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
            name="uit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>UIT</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            onClick={() => {
              append({
                nombre: "",
                idTipoPresupuesto: "",
                idStatus: "0",                
              });
            }}
          >
            <CirclePlus />
            Agregar Presupuesto
          </Button>
        </div>

        <Separator className="my-4" />

        {fields.map((field, index) => {
          const selectedTipoPresupuesto = form.watch(`presupuestos.${index}.idTipoPresupuesto`);          

          return (
            <div key={field.id}>
              <div className="flex justify-between items-end mb-4 min-w-full gap-5">
                <div className="flex-1">
                  <FormField
                    name={`presupuestos.${index}.nombre`}
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
                </div>

                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name={`presupuestos.${index}.idTipoPresupuesto`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo Presupuesto</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tipoPresupuestoList.map((s) => (
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
                </div>                                
                
                <Button
                  type="button"
                  onClick={() => {
                    form.setValue(`presupuestos.${index}.procesos`, [
                      ...(form.getValues(`presupuestos.${index}.procesos`) || []),
                      { name: "", siglas: "" },
                    ]);
                  }}
                >
                  <CirclePlus className="mr-2" />                    
                </Button>               

                <Button type="button" onClick={() => remove(index)}>
                  <Trash2 />
                </Button>
              </div>

              <Separator className="my-4" />

              {/* Sección de procesos */}
              {selectedTipoPresupuesto !== "cm7qhjsz100072whsuaeee6n8" &&
                (form.watch(`presupuestos.${index}.procesos`) || []).map((_, procIndex) => (
                  <div key={procIndex} className="flex justify-between items-end mb-4 min-w-full gap-5">

                    <div className="flex-1">
                      <FormField
                        control={form.control}
                        name={`presupuestos.${index}.procesos.${procIndex}.siglas`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="sr-only">Siglas</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Siglas" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex-1">                      
                      <FormField
                        control={form.control}
                        name={`presupuestos.${index}.procesos.${procIndex}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="sr-only">Proceso</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Proceso" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button
                      type="button"
                      onClick={() => {
                        const procesosActuales = form.getValues(`presupuestos.${index}.procesos`) || [];
                        procesosActuales.splice(procIndex, 1);
                        form.setValue(`presupuestos.${index}.procesos`, procesosActuales);
                      }}
                    >
                      <Trash2 />
                    </Button>
                    
                  </div>

                  
              ))}                          
            </div>
          );
        })}        
        

        {isUpdating && (
          <div className="grid auto-rows-min gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="idStatusPeriodo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado Período</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar vigencia" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statusPeriodoList.map((s) => (
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
          </div>
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

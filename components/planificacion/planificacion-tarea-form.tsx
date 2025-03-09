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

import { tareaSchema, type TareaSchema } from "@/lib/zod";
import { Actividad } from "@prisma/client";
import { Textarea } from "../ui/textarea";

interface PlaniTareaFormProps {
  defaultValues: TareaSchema;
  onSubmit: (data: TareaSchema) => Promise<void>;
  submitButtonText: string;
  isSubmitting: boolean;  
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function PlaniTareaForm({
  defaultValues,
  onSubmit,
  submitButtonText,
  isSubmitting  
}: PlaniTareaFormProps) {
  const form = useForm<TareaSchema>({
    resolver: zodResolver(tareaSchema),
    defaultValues,
  });  

  const { data: actividades } = useSWR<Actividad[]>("/api/actividades", fetcher);
  const actividadList = actividades || [];
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="codigo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tarea"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tarea</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tarea"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="idActividad"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Actividad</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione actividad" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {actividadList.map((actividad) => (
                    <SelectItem key={actividad.id} value={actividad.id}>
                      {actividad.codigo} - {actividad.actividad}
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

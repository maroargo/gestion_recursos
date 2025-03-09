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

import { planificacionSchema, type PlanificacionSchema } from "@/lib/zod";
import { Presupuesto } from "@prisma/client";
import { useState } from "react";

interface PlanificacionFormProps {
  defaultValues: PlanificacionSchema; 
  onSubmit: (data: PlanificacionSchema) => Promise<void>;
  submitButtonText: string;
  isSubmitting: boolean;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function PlanificacionForm({
  defaultValues,
  onSubmit,
  submitButtonText,
  isSubmitting,  
}: PlanificacionFormProps) {
  const form = useForm<PlanificacionSchema>({
    resolver: zodResolver(planificacionSchema),
    defaultValues,
  });  

  const [file, setFile] = useState<File | null>(null);  

  const { data: presupuestos } = useSWR<Presupuesto[]>("/api/presupuestos/active", fetcher);
  const presupuestoList = presupuestos || [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      form.setValue("archivo", e.target.files[0]);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">        

        <FormField
          control={form.control}
          name="idPresupuesto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Presupuesto</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione presupuesto" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {presupuestoList.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />                                                   

        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
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

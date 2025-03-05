"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

import { defineServicioSchema, type DefineServicioSchema } from "@/lib/zod";
import { useState } from "react";

interface ServicioFormProps {
  defaultValues: DefineServicioSchema;
  onSubmit: (data: DefineServicioSchema) => Promise<void>;
  submitButtonText: string;
  isSubmitting: boolean;
  isUpdating: boolean;
}

const meses = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export default function DefineServicioForm({
  defaultValues,
  onSubmit,
  submitButtonText,
  isSubmitting,
  isUpdating,
}: ServicioFormProps) {
  const form = useForm<DefineServicioSchema>({
    resolver: zodResolver(defineServicioSchema),
    defaultValues,
  });

  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const costPerMonth = parseFloat(defaultValues.precioUnitario ?? "") || 100; // Ajusta el costo según necesidad
  
  const handleCheckboxChange = (month: string) => {
    setSelectedMonths((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]
    );
  };

  const totalCosto = selectedMonths.length * costPerMonth;

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

        <div>
          <FormLabel>Meses</FormLabel>
          <div className="grid grid-cols-3 gap-2">
            {meses.map((mes) => (
              <label key={mes} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={mes}
                  checked={selectedMonths.includes(mes)}
                  onChange={() => handleCheckboxChange(mes)}
                />
                {mes}
              </label>
            ))}
          </div>
        </div>

        <div className="text-lg font-bold">Total Costo: S/. {totalCosto}</div>     

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

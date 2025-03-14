"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { periodoSchema, type PeriodoSchema } from "@/lib/zod";
import { useState } from "react";

import { mutate } from "swr";
import PeriodoForm from "./periodo-form";
import { useToast } from "@/hooks/use-toast";

export default function CreatePeriodo() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);

  const { toast } = useToast();
  
  const form = useForm<PeriodoSchema>({
    resolver: zodResolver(periodoSchema),
    defaultValues: {      
      periodo: "",
      descripcion: "",
      nombre: "",
      uit: "",
      presupuestos: [],
      idStatus: "0"
    },
  });

  const onSubmit = async (data: PeriodoSchema) => {
    setIsSubmitting(true);
    try {
      const updatedPresupuestos = data.presupuestos.map((detail) => {
        return {
          ...detail,          
        };
      });

      const updatedData = {
        ...data,
        presupuestos: updatedPresupuestos,
      };

      const response = await fetch("/api/periodos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || "Ocurrió un error"
        );
      }
      form.reset();
      setDialogOpen(false);
      mutate("/api/periodos");
      setErrorMessage("");

      toast({
        title: "Éxito",
        description: "Periodo creado satisfactoriamente.",
      })
    } catch (error) {      
      const errorMessage =
        error instanceof Error ? error.message : "Ocurrió un error";
      setErrorMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>Crear</Button>
      </DialogTrigger>      
      
      <DialogContent className="sm:max-w-[625px] overflow-auto bg-white">
        <DialogHeader>
          <DialogTitle>Crear Presupuesto</DialogTitle>
        </DialogHeader>
        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}
        <PeriodoForm
          defaultValues={{            
            periodo: "",
            descripcion: "",
            nombre: "",
            uit: "",
            presupuestos: [],
            idStatus: "0",            
          }}
          onSubmit={onSubmit}
          submitButtonText="Crear"
          isSubmitting={isSubmitting}
          isUpdating={isUpdating}
        />
      </DialogContent>
    </Dialog>
  );
}

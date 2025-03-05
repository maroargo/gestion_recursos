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

import { gerenciaSchema, type GerenciaSchema } from "@/lib/zod";
import { useState } from "react";

import { mutate } from "swr";
import GerenciaForm from "./gerencia-form";
import { useToast } from "@/hooks/use-toast";

export default function CreateGerencia() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);

  const { toast } = useToast();
  
  const form = useForm<GerenciaSchema>({
    resolver: zodResolver(gerenciaSchema),
    defaultValues: {
      nombre: "",
      siglas: "",
      titular: "",
      idStatus: "0"
    },
  });

  const onSubmit = async (data: GerenciaSchema) => {
    setIsSubmitting(true);
    try {      
      const response = await fetch("/api/gerencias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || "Ocurrió un error"
        );
      }
      form.reset();
      setDialogOpen(false);
      mutate("/api/gerencias");
      setErrorMessage("");

      toast({
        title: "Éxito",
        description: "Gerencia creada satisfactoriamente.",
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
      
      <DialogContent className="sm:max-w-[425px] overflow-auto bg-white">
        <DialogHeader>
          <DialogTitle>Crear Gerencia</DialogTitle>
        </DialogHeader>
        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}
        <GerenciaForm
          defaultValues={{
            nombre: "",
            siglas: "",
            titular: "", 
            idOrganization: "",
            idStatus: "0"            
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

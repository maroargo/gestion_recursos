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

import { perfilAcademicoSchema, type PerfilAcademicoSchema } from "@/lib/zod";
import { useState } from "react";

import { mutate } from "swr";
import PerfilAcademicoForm from "./perfil-form";
import { useToast } from "@/hooks/use-toast";

export default function CreatePerfilAcademico() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);

  const { toast } = useToast();
  
  const form = useForm<PerfilAcademicoSchema>({
    resolver: zodResolver(perfilAcademicoSchema),
    defaultValues: {
      cargo: "",
      monto: "",
      perfilAcademico: "",
      carrera: "",
      curso: "",
      experiencia: "",
      tiempoExperiencia: "",
      idSubgerencia: "" 
    },
  });

  const onSubmit = async (data: PerfilAcademicoSchema) => {
    setIsSubmitting(true);
    try {      
      const response = await fetch("/api/perfilAcademicos", {
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
      mutate("/api/perfilAcademicos");
      setErrorMessage("");

      toast({
        title: "Éxito",
        description: "Perfil Académico creado satisfactoriamente.",
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
          <DialogTitle>Crear Perfil Académico</DialogTitle>
        </DialogHeader>
        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}
        <PerfilAcademicoForm
          defaultValues={{
            cargo: "",
            monto: "",
            perfilAcademico: "",
            carrera: "",
            curso: "",
            experiencia: "",
            tiempoExperiencia: "",
            idSubgerencia: "",
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

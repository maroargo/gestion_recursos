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
import * as XLSX from "xlsx";

import { programacionSchema, type ProgramacionSchema } from "@/lib/zod";
import { useState } from "react";
import ProgramacionForm from "./programacion-form";
import { useToast } from "@/hooks/use-toast";
import { mutate } from "swr";

export default function CreateProgramacion() {  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);
  
  const { toast } = useToast();

  const form = useForm<ProgramacionSchema>({
    resolver: zodResolver(programacionSchema),
    defaultValues: {      
      idPresupuesto: "",
      archivo: null 
    },
  });
  
  const onSubmit = async (info: ProgramacionSchema) => {
    setIsSubmitting(true);
    try {
      
      if (!info.archivo) {
        toast({
          title: "Error",
          description: "Por favor, selecciona un archivo Excel.",
        })        
        return;
      }

      const reader = new FileReader();

      reader.onload = async (e) => {
        if (!e.target?.result || !(e.target.result instanceof ArrayBuffer)) {
          toast({
            title: "Error",
            description: "Error al leer el archivo.",
          })                
          return;
        }

        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        try {
          const response = await fetch(`/api/programacion?idPresupuesto=${info.idPresupuesto}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reportes: jsonData }),
          });

          if (!response.ok) throw new Error("Error al subir los datos");
          
          form.reset();
          setDialogOpen(false);
          mutate(`/api/servicios`);
          setErrorMessage("");

          toast({
            title: "Éxito",
            description: "Datos registrados correctamente.",
          })

        } catch (error) {
          toast({
            title: "Error",
            description: "Error al procesar el archivo.",
          })                                
        }
      };
      reader.readAsArrayBuffer(info.archivo);

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
        <Button>Cargar</Button>
      </DialogTrigger>      
      
      <DialogContent className="sm:max-w-[425px] overflow-auto bg-white">
        <DialogHeader>
          <DialogTitle>Procesar</DialogTitle>
        </DialogHeader>
        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}
        <ProgramacionForm
          defaultValues={{            
            idPresupuesto: "",
            archivo: null
          }} 
          onSubmit={onSubmit}
          submitButtonText="Procesar"
          isSubmitting={isSubmitting}     
        />
      </DialogContent>
    </Dialog>
  );
}

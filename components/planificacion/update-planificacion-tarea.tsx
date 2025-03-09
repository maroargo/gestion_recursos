"use client";

import { useState } from "react";
import { mutate } from "swr";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { type TareaSchema } from "@/lib/zod";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useToast } from "@/hooks/use-toast";
import { IPlaniTarea } from "@/interfaces/tarea";
import PlaniTareaForm from "./planificacion-tarea-form";

export default function UpdatePlaniTarea({ planiTarea }: { planiTarea: IPlaniTarea }) {
    const [isSubmitting, setIsSubmitting] = useState(false);    
    const [errorMessage, setErrorMessage] = useState("");
    const [isDialogOpen, setDialogOpen] = useState(false);

    const { toast } = useToast();

    const onSubmit = async (data: TareaSchema) => {
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/planificacion", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, id: planiTarea.idTarea }),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(
                    responseData.message || "Ocurrió un error"
                );
            }

            setErrorMessage("");
            setDialogOpen(false);
            mutate(`/api/planificacion/id?idPresupuesto=${planiTarea.idPresupuesto}`);

            toast({
              title: "Éxito",
              description: "Tarea actualizada satisfactoriamente.",
            });
        } catch (error) {            
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Ocurrió un error";
            setErrorMessage(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="mr-1 text-blue-500 bg-blue-100 hover:text-blue-700 hover:bg-blue-200"
                >
                    <Pencil1Icon className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px] overflow-auto bg-white">
                <DialogHeader>
                    <DialogTitle>Actualizar Tarea</DialogTitle>
                </DialogHeader>
                {errorMessage && (
                    <div className="text-red-500 text-sm mb-4">
                        {errorMessage}
                    </div>
                )}
                <PlaniTareaForm
                    defaultValues={{
                        codigo: planiTarea.codigo || "",                        
                        tarea: planiTarea.nombre || "",
                        idActividad: planiTarea.idActividad || ""                        
                    }}
                    onSubmit={onSubmit}
                    submitButtonText="Actualizar"
                    isSubmitting={isSubmitting}                    
                />
            </DialogContent>
        </Dialog>
    );
}

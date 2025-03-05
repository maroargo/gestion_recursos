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

import ServicioForm from "@/components/servicios/servicio-form";
import { type ServicioSchema } from "@/lib/zod";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useToast } from "@/hooks/use-toast";
import { Status } from "@prisma/client";
import { IServicio } from "@/interfaces/servicio";

export default function UpdateServicio({ servicio }: { servicio: IServicio }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [isDialogOpen, setDialogOpen] = useState(false);

    const { toast } = useToast();

    const onSubmit = async (data: ServicioSchema) => {
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/servicios", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, id: servicio.id }),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(
                    responseData.message || "Ocurrió un error"
                );
            }

            setErrorMessage("");
            setDialogOpen(false);
            mutate("/api/servicios");

            toast({
              title: "Éxito",
              description: "Servicio actualizado satisfactoriamente.",
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
                    <DialogTitle>Actualizar Servicio</DialogTitle>
                </DialogHeader>
                {errorMessage && (
                    <div className="text-red-500 text-sm mb-4">
                        {errorMessage}
                    </div>
                )}
                <ServicioForm
                    defaultValues={{
                        descripcion: servicio.descripcion || "",
                        idPeriodo: servicio.idPeriodo || "",
                        idGerencia: servicio.idGerencia || "",                        
                        idSubgerencia: servicio.idSubgerencia || "",
                        idMeta: servicio.idMeta || "",                        
                        idTipoContrato: servicio.idTipoContrato || "",
                        idGenericaGasto: servicio.idGenericaGasto || "",
                        clasificador: servicio.clasificador || "",
                        idUnidadMedida: servicio.idUnidadMedida || "",
                        cantidad: servicio.cantidad || 0,
                        precioUnitario: servicio.precioUnitario || "",                                                                            
                        idStatus: servicio.status == Status.activo ? "0" : "1",                        
                    }}
                    onSubmit={onSubmit}
                    submitButtonText="Actualizar"
                    isSubmitting={isSubmitting}
                    isUpdating={isUpdating}
                />
            </DialogContent>
        </Dialog>
    );
}

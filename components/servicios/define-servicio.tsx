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

import DefineServicioForm from "@/components/servicios/define-servicio-form";
import { type DefineServicioSchema } from "@/lib/zod";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useToast } from "@/hooks/use-toast";
import { IServicio } from "@/interfaces/servicio";
import { Calendar } from "lucide-react";

export default function DefineServicio({ servicio }: { servicio: IServicio }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [isDialogOpen, setDialogOpen] = useState(false);

    const { toast } = useToast();

    const onSubmit = async (data: DefineServicioSchema) => {
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/servicios/define", {
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
                    <Calendar className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[725px] overflow-auto bg-white">
                <DialogHeader>
                    <DialogTitle>Establecer tiempos</DialogTitle>
                </DialogHeader>
                {errorMessage && (
                    <div className="text-red-500 text-sm mb-4">
                        {errorMessage}
                    </div>
                )}
                <DefineServicioForm
                    defaultValues={{
                        descripcion: servicio.descripcion || "",
                        cantidad: servicio.cantidad || 0,
                        precioUnitario: servicio.precioUnitario || "",
                        enero: servicio.enero || 0,
                        febrero: servicio.febrero || 0,
                        marzo: servicio.marzo || 0,
                        abril: servicio.abril || 0,
                        mayo: servicio.mayo || 0,
                        junio: servicio.junio || 0,
                        julio: servicio.julio || 0,
                        agosto: servicio.agosto || 0,
                        setiembre: servicio.setiembre || 0,
                        octubre: servicio.octubre || 0,
                        noviembre: servicio.noviembre || 0,
                        diciembre: servicio.diciembre || 0,
                        totalCosto: servicio.totalCosto || "",
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

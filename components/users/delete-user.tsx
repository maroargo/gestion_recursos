"use client";

import { Button } from "@/components/ui/button";
import { TrashIcon } from "@radix-ui/react-icons";
import { mutate } from "swr";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function DeleteUser({ id }: { id: string }) {
  const { toast } = useToast();

  const handleDelete = async () => {
    const response = await fetch(`/api/users?id=${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      toast({
        title: "Éxito",
        description: "Usuario eliminado satisfactoriamente.",
      });
      mutate("/api/users");
    } else {
      toast({
        title: "Error",
        description: "Ocurrió un error.",
      });      
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="mr-1 text-red-500 bg-red-100 hover:text-red-700 hover:bg-red-200"
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Advertencia</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Está seguro que desea eliminar el usuario?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Aceptar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

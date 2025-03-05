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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

import { servicioSchema, type ServicioSchema } from "@/lib/zod";
import { IStatus } from "@/interfaces/status";
import {
  GenericaGasto,
  Gerencia,
  Meta,
  Subgerencia,
  TipoContrato,
  TipoPresupuesto,
  UnidadMedida,
} from "@prisma/client";
import { useEffect, useState } from "react";

interface ServicioFormProps {
  defaultValues: ServicioSchema;
  onSubmit: (data: ServicioSchema) => Promise<void>;
  submitButtonText: string;
  isSubmitting: boolean;
  isUpdating: boolean;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ServicioForm({
  defaultValues,
  onSubmit,
  submitButtonText,
  isSubmitting,
  isUpdating,
}: ServicioFormProps) {
  const form = useForm<ServicioSchema>({
    resolver: zodResolver(servicioSchema),
    defaultValues,
  });

  const { data: gerencias } = useSWR<Gerencia[]>(
    "/api/gerencias/active",
    fetcher
  );
  const gerenciaList = gerencias || [];
  const [subgerenciaList, setSubgerenciaList] = useState<Subgerencia[]>([]);
  const [selectedGerencia, setSelectedGerencia] = useState("");

  const statusList: IStatus[] = [
    { id: "0", name: "Activo" },
    { id: "1", name: "Inactivo" },
  ];

  const { data: metas } = useSWR<Meta[]>("/api/metas/active", fetcher);
  const metaList = metas || [];

  const { data: tipoContratos } = useSWR<TipoContrato[]>(
    "/api/tipoContratos",
    fetcher
  );
  const tipoContratoList = tipoContratos || [];
  const { data: gastos } = useSWR<GenericaGasto[]>(
    "/api/genericaGastos",
    fetcher
  );
  const gastoList = gastos || [];
  const { data: medidas } = useSWR<UnidadMedida[]>(
    "/api/unidadMedidas",
    fetcher
  );
  const medidaList = medidas || [];

  // useEffect para cargar subgerencias cuando se selecciona una gerencia
  useEffect(() => {
    if (selectedGerencia) {
      const fetchSubgerencias = async () => {
        const response = await fetch(
          `/api/subgerencias/gerencia?idGerencia=${selectedGerencia}`
        );
        const subgerenciasData: Subgerencia[] = await response.json();
        setSubgerenciaList(subgerenciasData || []);
      };

      fetchSubgerencias();
    }
  }, [selectedGerencia]); // Este efecto se ejecuta cuando cambia la gerencia seleccionada

  // Este efecto garantiza que cuando cargamos valores para actualizar, también se obtengan las subgerencias
  useEffect(() => {
    if (defaultValues.idGerencia) {
      setSelectedGerencia(defaultValues.idGerencia);
    }
  }, [defaultValues.idGerencia]);

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

        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="idGerencia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gerencia</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedGerencia(value); // Actualizamos la gerencia seleccionada
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {gerenciaList.map((ger) => (
                      <SelectItem key={ger.id} value={ger.id}>
                        {ger.siglas}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="idSubgerencia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sub Gerencia</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subgerenciaList.map((sger) => (
                      <SelectItem key={sger.id} value={sger.id}>
                        {sger.siglas}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="idMeta"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meta</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione meta" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {metaList.map((meta) => (
                    <SelectItem key={meta.id} value={meta.id}>
                      {meta.codigo} - {meta.meta}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="idTipoContrato"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo Contrato</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione tipo contrato" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tipoContratoList.map((contrato) => (
                    <SelectItem key={contrato.id} value={contrato.id}>
                      {contrato.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="idGenericaGasto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gasto</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione gasto" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {gastoList.map((gasto) => (
                      <SelectItem key={gasto.id} value={gasto.id}>
                        {gasto.value} - {gasto.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="clasificador"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Clasificador</FormLabel>
                <FormControl>
                  <Input placeholder="Clasificador" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="cantidad"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cantidad</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Cantidad"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="precioUnitario"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio Unitario</FormLabel>
                <FormControl>
                  <Input placeholder="Precio Unitario" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="idUnidadMedida"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unidad de Medida</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione medida" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {medidaList.map((medida) => (
                      <SelectItem key={medida.id} value={medida.id}>
                        {medida.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {isUpdating && (
            <FormField
              control={form.control}
              name="idStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statusList.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

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

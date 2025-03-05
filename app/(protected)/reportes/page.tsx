"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";


export default function Reportes() {  
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Por favor, selecciona un archivo Excel");

    setLoading(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      if (!e.target?.result || !(e.target.result instanceof ArrayBuffer)) {
        alert("Error al leer el archivo");
        setLoading(false);
        return;
      }
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      try {
        const response = await fetch("/api/reportes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reportes: jsonData }),
        });

        if (!response.ok) throw new Error("Error al subir los datos");
        alert("Datos registrados correctamente");
      } catch (error) {
        console.error(error);
        alert("Error al procesar el archivo");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="p-4">
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      <Button onClick={handleUpload} disabled={loading} className="mt-2">
        {loading ? "Subiendo..." : "Subir Archivo"}
      </Button>
    </div>
  );
}

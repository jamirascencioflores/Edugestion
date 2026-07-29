// src/components/BannerAnunciosSaaS.jsx

import { useState, useEffect } from "react";
import { AlertTriangle, Wrench, Info } from "lucide-react";
import api from "@/api/axiosConfig";

export default function BannerAnunciosSaaS() {
  const [anuncios, setAnuncios] = useState([]);

  useEffect(() => {
    let isMounted = true;
    api
      .get("/auth/superadmin/anuncios/activos")
      .then((res) => {
        if (isMounted) setAnuncios(res.data);
      })
      .catch((err) => console.error("Error al cargar anuncios SaaS", err));

    return () => {
      isMounted = false;
    };
  }, []);

  if (anuncios.length === 0) return null;

  return (
    <div className="space-y-3 mb-6">
      {anuncios.map((anuncio) => (
        <div
          key={anuncio.id}
          className={`p-4 rounded-2xl border flex items-start justify-between gap-3 shadow-sm ${
            anuncio.tipo === "URGENTE"
              ? "bg-rose-50 dark:bg-rose-950/40 border-rose-200 text-rose-900 dark:text-rose-200"
              : anuncio.tipo === "MANTENIMIENTO"
                ? "bg-amber-50 dark:bg-amber-950/40 border-amber-200 text-amber-900 dark:text-amber-200"
                : "bg-blue-50 dark:bg-blue-950/40 border-blue-200 text-blue-900 dark:text-blue-200"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              {anuncio.tipo === "URGENTE" && (
                <AlertTriangle className="text-rose-600" size={20} />
              )}
              {anuncio.tipo === "MANTENIMIENTO" && (
                <Wrench className="text-amber-600" size={20} />
              )}
              {anuncio.tipo === "INFORMATIVO" && (
                <Info className="text-blue-600" size={20} />
              )}
            </div>
            <div>
              <h4 className="text-sm font-bold">{anuncio.titulo}</h4>
              <p className="text-xs mt-1 leading-relaxed">{anuncio.mensaje}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

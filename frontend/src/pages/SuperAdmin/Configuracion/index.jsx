import { useState, useEffect } from "react";
import { Settings, Loader2 } from "lucide-react";
import api from "@/api/axiosConfig";
import { toast } from "sonner";
import MantenimientoCard from "./components/MantenimientoCard";
import ParametrosForm from "./components/ParametrosForm";

export default function Configuracion() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mantenimientoActivo, setMantenimientoActivo] = useState(false);

  const [config, setConfig] = useState({
    dominioBase: "edugestion.io",
    maxIntentosLogin: 5,
    mensajeMantenimiento:
      "La plataforma se encuentra en mantenimiento programado.",
  });

  useEffect(() => {
    let isMounted = true;

    const fetchConfig = async () => {
      try {
        const res = await api.get("/auth/superadmin/configuracion");
        if (isMounted && res.data) {
          setConfig({
            dominioBase: res.data.dominioBase ?? "edugestion.io",
            maxIntentosLogin: res.data.maxIntentosLogin ?? 5,
            mensajeMantenimiento: res.data.mensajeMantenimiento ?? "",
          });
          setMantenimientoActivo(!!res.data.modoMantenimiento);
        }
      } catch (error) {
        console.error("Error al obtener configuración:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchConfig();
    return () => {
      isMounted = false;
    };
  }, []);

  // Usa exactamente el mismo endpoint que tenías en GestionColegios
  const handleToggleMantenimiento = async (nuevoEstado) => {
    try {
      setSaving(true);
      const response = await api.put(
        `/auth/sistema/mantenimiento?activar=${nuevoEstado}`,
      );
      setMantenimientoActivo(nuevoEstado);
      toast.success(response.data.mensaje || "Estado del sistema actualizado");
    } catch (err) {
      console.error("Error al cambiar estado del sistema:", err);
      toast.error(
        err.response?.data?.error || "Error al cambiar estado del sistema",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSaveParametros = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.put("/auth/superadmin/configuracion", config);
      toast.success("Configuración actualizada correctamente");
    } catch (error) {
      console.error("Error al guardar parámetros:", error);
      toast.error("Error al guardar la configuración");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="animate-spin text-slate-400" size={36} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <Settings style={{ color: "var(--color-primary)" }} size={30} />
          Configuración Global
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Administra el estado del sistema y parámetros generales del SaaS.
        </p>
      </div>

      <MantenimientoCard
        mantenimientoActivo={mantenimientoActivo}
        onToggleMantenimiento={handleToggleMantenimiento}
        loading={saving}
      />

      <ParametrosForm
        config={config}
        setConfig={setConfig}
        onSubmit={handleSaveParametros}
        saving={saving}
      />
    </div>
  );
}

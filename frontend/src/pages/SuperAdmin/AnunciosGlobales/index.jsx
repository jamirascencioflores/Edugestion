import { useState, useEffect } from "react";
import { Megaphone, Plus, Loader2 } from "lucide-react";
import api from "@/api/axiosConfig";
import { toast } from "sonner";
import Swal from "sweetalert2";
import AnuncioCard from "./components/AnuncioCard";
import AnuncioModal from "./components/AnuncioModal";

export default function AnunciosGlobales() {
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAnuncio, setEditingAnuncio] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchAnuncios = async () => {
      try {
        const res = await api.get("/auth/superadmin/anuncios");
        if (isMounted) setAnuncios(res.data);
      } catch (error) {
        console.error("Error al obtener anuncios:", error);
        if (isMounted) toast.error("Error al cargar los anuncios globales");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAnuncios();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenModal = (anuncio = null) => {
    setEditingAnuncio(anuncio);
    setModalOpen(true);
  };

  const handleSaveAnuncio = async (formData) => {
    try {
      if (editingAnuncio) {
        const res = await api.put(
          `/auth/superadmin/anuncios/${editingAnuncio.id}`,
          formData,
        );
        setAnuncios(
          anuncios.map((a) => (a.id === editingAnuncio.id ? res.data : a)),
        );
        toast.success("Anuncio actualizado correctamente");
      } else {
        const res = await api.post("/auth/superadmin/anuncios", formData);
        setAnuncios([res.data, ...anuncios]);
        toast.success("Anuncio publicado con éxito");
      }
      setModalOpen(false);
    } catch (error) {
      console.error("Error al guardar anuncio:", error);
      toast.error("Ocurrió un error al procesar el anuncio");
    }
  };

  const handleToggleEstado = async (id, estadoActual) => {
    try {
      const res = await api.patch(
        `/auth/superadmin/anuncios/${id}/estado?activo=${!estadoActual}`,
      );
      setAnuncios(anuncios.map((a) => (a.id === id ? res.data : a)));
      toast.success(`Anuncio ${!estadoActual ? "activado" : "desactivado"}`);
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      toast.error("No se pudo cambiar el estado del anuncio");
    }
  };

  // 🟢 REEMPLAZO ÚNICAMENTE DE WINDOW.CONFIRM POR SWEETALERT2
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar anuncio?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      customClass: {
        popup: "rounded-2xl dark:bg-slate-800 dark:text-white",
        title: "font-bold text-lg",
      },
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/auth/superadmin/anuncios/${id}`);
        setAnuncios(anuncios.filter((a) => a.id !== id));
        toast.success("Anuncio eliminado");
      } catch (error) {
        console.error("Error al eliminar anuncio:", error);
        toast.error("No se pudo eliminar el anuncio");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <Megaphone style={{ color: "var(--color-primary)" }} size={30} />
            Anuncios Globales
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Gestiona avisos y banners de plataforma visibles para todos los
            usuarios.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2.5 text-white rounded-xl text-sm font-semibold shadow-md transition-all hover:opacity-90"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          <Plus size={18} /> Nuevo Anuncio
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-slate-400" size={36} />
        </div>
      ) : anuncios.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-10 text-center border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
          <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-700/50 w-fit mx-auto text-slate-400">
            <Megaphone size={32} />
          </div>
          <h3 className="text-lg font-bold">No hay anuncios registrados</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Crea comunicados informativos o advertencias de mantenimiento que
            aparecerán en los tableros de todos los colegios.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {anuncios.map((anuncio) => (
            <AnuncioCard
              key={anuncio.id}
              anuncio={anuncio}
              onToggleEstado={handleToggleEstado}
              onEdit={handleOpenModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {modalOpen && (
        <AnuncioModal
          key={editingAnuncio?.id || "new"}
          anuncio={editingAnuncio}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSaveAnuncio}
        />
      )}
    </div>
  );
}

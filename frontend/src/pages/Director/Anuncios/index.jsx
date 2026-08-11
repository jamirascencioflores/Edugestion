import { useState, useEffect, useCallback } from "react";
import { Megaphone, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "../../../api/axiosConfig";
import KpiCardsAnuncios from "./KpiCardsAnuncios";
import FiltrosAnuncios from "./FiltrosAnuncios";
import ModalNuevoAnuncio from "./ModalNuevoAnuncio";
import ListaAnuncios from "./ListaAnuncios";

export default function AnunciosIndex() {
  const [anuncios, setAnuncios] = useState([]);
  const [grados, setGrados] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtroPrioridad, setFiltroPrioridad] = useState("TODOS");

  const fetchData = useCallback(async () => {
    try {
      const [resAnuncios, resGrados, resSecciones] = await Promise.all([
        api.get("/comunicaciones/anuncios"),
        api.get("/academicos/grados"),
        api.get("/academicos/secciones"),
      ]);
      setAnuncios(resAnuncios.data || []);
      setGrados(resGrados.data || []);
      setSecciones(resSecciones.data || []);
    } catch {
      toast.error("Error al cargar los comunicados");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    const loadInitialData = async () => {
      try {
        const [resAnuncios, resGrados, resSecciones] = await Promise.all([
          api.get("/comunicaciones/anuncios"),
          api.get("/academicos/grados"),
          api.get("/academicos/secciones"),
        ]);
        if (!ignore) {
          setAnuncios(resAnuncios.data || []);
          setGrados(resGrados.data || []);
          setSecciones(resSecciones.data || []);
        }
      } catch {
        if (!ignore) toast.error("Error al cargar los comunicados");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadInitialData();

    return () => {
      ignore = true;
    };
  }, []);

  const anunciosFiltrados = anuncios.filter((a) => {
    const coincideTexto =
      a.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.contenido.toLowerCase().includes(searchQuery.toLowerCase());
    const coincidePrioridad =
      filtroPrioridad === "TODOS" || a.prioridad === filtroPrioridad;
    return coincideTexto && coincidePrioridad;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Megaphone size={24} style={{ color: "var(--color-primary)" }} />
            <span>Comunicados y Anuncios</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Publica avisos oficiales para apoderados y la comunidad escolar.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{ backgroundColor: "var(--color-primary)" }}
          className="text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all hover:opacity-90 shadow-sm text-sm font-semibold"
        >
          <Plus size={18} />
          <span>Nuevo Comunicado</span>
        </button>
      </div>

      <KpiCardsAnuncios anuncios={anuncios} />

      <FiltrosAnuncios
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filtroPrioridad={filtroPrioridad}
        setFiltroPrioridad={setFiltroPrioridad}
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <p className="text-sm text-slate-500">Cargando comunicados...</p>
        </div>
      ) : (
        <ListaAnuncios
          anuncios={anunciosFiltrados}
          grados={grados}
          secciones={secciones}
          onRefresh={fetchData}
        />
      )}

      {isModalOpen && (
        <ModalNuevoAnuncio
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}

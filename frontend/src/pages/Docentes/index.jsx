import { useState, useEffect } from "react";
import {
  BookOpen,
  Calendar,
  CheckCircle,
  Users,
  GraduationCap,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosConfig";

export default function DashboardDocente() {
  const { user } = useAuth();
  const nombreUsuario = user?.nombre || "Profesor";

  const [misAsignaciones, setMisAsignaciones] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatosDashboard = async () => {
      if (!user) return;
      if (!user.userId) {
        setLoading(false);
        return;
      }

      try {
        const [resAsignaciones, resCursos, resSecciones] = await Promise.all([
          api.get(`/academicos/asignaciones/docente/${user.userId}`),
          api.get("/academicos/cursos"),
          api.get("/academicos/secciones"),
        ]);

        setMisAsignaciones(resAsignaciones.data);
        setCursos(resCursos.data);
        setSecciones(resSecciones.data);
      } catch (error) {
        console.error("Error al cargar dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatosDashboard();
  }, [user]);

  const stats = [
    {
      title: "Cursos Asignados",
      value: loading ? "..." : misAsignaciones.length.toString(),
      icon: <Calendar className="text-blue-500" size={24} />,
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Alumnos Totales",
      // TODO: Sprint 5/7 - Hacer dinámico sumando los alumnos de las secciones asignadas
      value: "120",
      icon: <Users className="text-green-500" size={24} />,
      bg: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "Tareas por Revisar",
      // TODO: Sprint 5/7 - Conectar con el endpoint de tareas pendientes
      value: "15",
      icon: <CheckCircle className="text-orange-500" size={24} />,
      bg: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      title: "Materiales Subidos",
      // TODO: Sprint 5/7 - Conectar con el endpoint de materiales subidos
      value: "32",
      icon: <BookOpen className="text-purple-500" size={24} />,
      bg: "bg-purple-50 dark:bg-purple-900/20",
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Saludo */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            ¡Hola de nuevo, {nombreUsuario}! 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Aquí tienes un resumen de tus actividades académicas para el día de
            hoy.
          </p>
        </div>
        <div className="hidden md:block">
          <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full font-semibold text-sm border border-indigo-100 dark:border-indigo-800">
            Ciclo Escolar 2026
          </div>
        </div>
      </div>

      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4 transition-transform hover:scale-105"
          >
            <div className={`p-4 rounded-xl ${stat.bg}`}>{stat.icon}</div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {stat.title}
              </p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Mis Asignaturas y Aulas */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <GraduationCap className="text-primary" size={24} />
          Mis Asignaturas y Aulas
        </h2>

        {loading ? (
          <div className="text-center py-8 text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
            Cargando tus cursos asignados...
          </div>
        ) : misAsignaciones.length === 0 ? (
          <div className="text-center py-8 text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
            Aún no tienes cursos asociados en la malla curricular institucional.
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4 font-medium">Curso / Materia</th>
                    <th className="px-6 py-4 font-medium text-right">
                      Sección asignada
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {misAsignaciones.map((asig) => {
                    const curso = cursos.find(
                      (c) => c.id.toString() === asig.cursoId.toString(),
                    );
                    const seccion = secciones.find(
                      (s) => s.id.toString() === asig.seccionId.toString(),
                    );

                    return (
                      <tr
                        key={asig.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                          {curso ? curso.nombre : `Curso ID: ${asig.cursoId}`}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300">
                            {seccion
                              ? seccion.nombre
                              : `Sección ID: ${asig.seccionId}`}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

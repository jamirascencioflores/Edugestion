// src/utils/exportarDashboardExcel.js
import ExcelJS from "exceljs";

export const generarExcelDashboard = async (metrics) => {
  if (!metrics) throw new Error("No hay datos disponibles para exportar.");

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "EduGestión";
  workbook.created = new Date();

  const estilizarFila = (row, bg = "1E293B", color = "FFFFFF") => {
    row.font = { bold: true, color: { argb: color }, size: 11 };
    row.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bg } };
    row.alignment = { vertical: "middle" };
    row.height = 24;
  };

  // Hoja 1: Resumen General de KPIs
  const wsKpis = workbook.addWorksheet("Resumen Ejecutivo");
  wsKpis.columns = [
    { header: "Métrica / Indicador", key: "kpi", width: 35 },
    { header: "Valor Registrado", key: "valor", width: 25 },
    { header: "Estado / Detalle", key: "detalle", width: 30 },
  ];
  estilizarFila(wsKpis.getRow(1), "4F46E5");

  wsKpis.addRow({
    kpi: "Total Estudiantes Matriculados",
    valor: metrics.totalEstudiantes,
    detalle: `${metrics.seccionesActivas} secciones activas (+${metrics.porcentajeCrecimientoEstudiantes}%)`,
  });

  wsKpis.addRow({
    kpi: "Plana Docente",
    valor: metrics.totalDocentes,
    detalle:
      metrics.docentesSinAsignar === 0
        ? "100% Asignados"
        : `${metrics.docentesSinAsignar} sin asignación`,
  });

  wsKpis.addRow({
    kpi: "Recaudación del Mes Actual",
    valor: `S/ ${Number(metrics.recaudoMesActual || 0).toFixed(2)}`,
    detalle: `${metrics.porcentajeRecaudoMes}% de efectividad`,
  });

  wsKpis.addRow({
    kpi: "Tasa de Morosidad",
    valor: `${metrics.porcentajeMorosidad}%`,
    detalle: `${metrics.alumnosMorosos} alumnos con mensualidades vencidas`,
  });

  // Hoja 2: Recaudación Mes a Mes
  if (metrics.recaudacionMensual?.length > 0) {
    const wsMeses = workbook.addWorksheet("Recaudación Mensual");
    wsMeses.columns = [
      { header: "Mes", key: "mes", width: 15 },
      { header: "% Cobrado", key: "recaudado", width: 18 },
      { header: "% Pendiente", key: "pendiente", width: 18 },
    ];
    estilizarFila(wsMeses.getRow(1), "1E293B");

    metrics.recaudacionMensual.forEach((m) => {
      wsMeses.addRow({
        mes: m.mes,
        recaudado: `${m.recaudado}%`,
        pendiente: `${m.pendiente}%`,
      });
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Reporte_Ejecutivo_Director_${new Date().toISOString().slice(0, 10)}.xlsx`;
  a.click();
  window.URL.revokeObjectURL(url);
};

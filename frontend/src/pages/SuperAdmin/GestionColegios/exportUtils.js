import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const exportarColegiosExcel = async (colegios) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Reporte de Colegios");

  // 1. Definir las columnas con sus anchos correspondientes
  worksheet.columns = [
    { header: "Nombre de Institución", key: "nombre", width: 35 },
    { header: "Portal Web", key: "portal", width: 30 },
    { header: "Responsable", key: "responsable", width: 25 },
    { header: "Correo del Responsable", key: "correo", width: 35 },
    { header: "Plan", key: "plan", width: 15 },
    { header: "Estado", key: "estado", width: 15 },
  ];

  // 2. Estilizar el encabezado (Fondo morado/primario, texto blanco y negrita)
  const filaEncabezado = worksheet.getRow(1);
  filaEncabezado.eachCell((celda) => {
    celda.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4F46E5" }, // Ajusta el color hex a tu primary
    };
    celda.font = { color: { argb: "FFFFFFFF" }, bold: true, size: 11 };
    celda.alignment = { vertical: "middle", horizontal: "center" };
    celda.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });
  filaEncabezado.height = 25;

  // 3. Insertar los datos
  colegios.forEach((c) => {
    const fila = worksheet.addRow({
      nombre: c.nombre,
      portal: `${c.subdominio}.edugestion.io`,
      responsable:
        c.responsableNombre !== "Sin asignar"
          ? c.responsableNombre
          : "Sin asignar",
      correo: c.emailResponsable || c.responsableEmail || "No registrado",
      plan: c.plan || "N/A",
      estado: c.estado ? "Activo" : "Inactivo",
    });

    // Alinear las columnas de plan y estado al centro
    fila.getCell("plan").alignment = { horizontal: "center" };
    fila.getCell("estado").alignment = { horizontal: "center" };
  });

  // 4. Generar y descargar el archivo
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(
    blob,
    `EduGestion_Colegios_${new Date().toISOString().split("T")[0]}.xlsx`,
  );
};

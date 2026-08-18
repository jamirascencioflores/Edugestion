// src/utils/excelGenerator.js
import ExcelJS from "exceljs";

/**
 * Función genérica para construir y descargar un archivo Excel estilizado
 */
const generarExcel = async (
  nombreArchivo,
  nombreHoja,
  columnas,
  ejemploFila,
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(nombreHoja);

  // 1. Configurar Cabeceras con formato texto ('@') por defecto para evitar truncado de ceros
  worksheet.columns = columnas.map((col) => ({
    header: col.header,
    key: col.key,
    width: col.width || 20,
    style: { numFmt: "@" }, // Fuerza a Excel a interpretar todas las celdas como Texto
  }));

  // 2. Estilar la fila de cabecera (Fila 1)
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FFFFFF" }, size: 11 };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "4F46E5" }, // Color Primario
  };
  headerRow.alignment = { vertical: "middle", horizontal: "center" };
  headerRow.height = 26;

  // 3. Fila de ejemplo / guía
  if (ejemploFila) {
    const rowEjemplo = worksheet.addRow(ejemploFila);
    rowEjemplo.font = { italic: true, color: { argb: "6B7280" } };
  }

  // 4. Descarga
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${nombreArchivo}.xlsx`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

// --- PLANTILLAS MODULARES POR PASOS ---

export const plantillaGenerators = {
  // PASO 1: ESTRUCTURA ACADÉMICA Y CURSOS (4 columnas)
  descargarEstructura: () => {
    const columnas = [
      { header: "Nivel", key: "nivel", width: 16 },
      { header: "Grado", key: "grado", width: 22 },
      { header: "Sección", key: "seccion", width: 14 },
      { header: "Curso", key: "curso", width: 24 },
    ];

    const ejemplo = {
      nivel: "Secundaria",
      grado: "1er Año Secundaria",
      seccion: "A",
      curso: "Matemática",
    };

    return generarExcel(
      "plantilla_paso1_estructura",
      "Estructura",
      columnas,
      ejemplo,
    );
  },

  // PASO 2: PLANA DOCENTE (5 columnas)
  descargarDocentes: () => {
    const columnas = [
      { header: "DNI", key: "dni", width: 16 },
      { header: "Nombres", key: "nombres", width: 22 },
      { header: "Apellidos", key: "apellidos", width: 22 },
      { header: "Email", key: "email", width: 28 },
      { header: "Teléfono", key: "telefono", width: 18 },
    ];

    const ejemplo = {
      dni: "01234567",
      nombres: "Juan Carlos",
      apellidos: "Pérez Gómez",
      email: "j.perez@colegio.edu.pe",
      telefono: "987654321",
    };

    return generarExcel(
      "plantilla_paso2_docentes",
      "Docentes",
      columnas,
      ejemplo,
    );
  },

  // PASO 3: ESTUDIANTES Y APODERADOS (11 columnas)
  descargarEstudiantes: () => {
    const columnas = [
      { header: "DNI Alumno", key: "dniAlumno", width: 16 },
      { header: "Nombres Alumno", key: "nombresAlumno", width: 22 },
      { header: "Apellidos Alumno", key: "apellidosAlumno", width: 22 },
      { header: "Grado", key: "grado", width: 22 },
      { header: "Sección", key: "seccion", width: 14 },
      { header: "Fecha Nacimiento", key: "fechaNacimiento", width: 18 },
      { header: "Fecha Inscripción", key: "fechaInscripcion", width: 18 },
      { header: "DNI Apoderado", key: "dniApoderado", width: 16 },
      { header: "Nombres Apoderado", key: "nombresApoderado", width: 22 },
      { header: "Apellidos Apoderado", key: "apellidosApoderado", width: 22 },
      { header: "Teléfono Apoderado", key: "telefonoApoderado", width: 18 },
    ];

    const ejemplo = {
      dniAlumno: "08765432",
      nombresAlumno: "Maria",
      apellidosAlumno: "López Silva",
      grado: "1er Año Secundaria",
      seccion: "A",
      fechaNacimiento: "15/05/2012",
      fechaInscripcion: "15/02/2026",
      dniApoderado: "09876543",
      nombresApoderado: "Carlos",
      apellidosApoderado: "López Mendoza",
      telefonoApoderado: "987654321",
    };

    return generarExcel(
      "plantilla_paso3_estudiantes",
      "Estudiantes",
      columnas,
      ejemplo,
    );
  },
};

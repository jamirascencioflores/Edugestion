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

  // 1. Configurar Cabeceras
  worksheet.columns = columnas.map((col) => ({
    header: col.header,
    key: col.key,
    width: col.width || 20,
  }));

  // 2. Estilar la fila de cabecera (Fila 1)
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FFFFFF" }, size: 11 };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "4F46E5" }, // Color Morado / Indigo primario
  };
  headerRow.alignment = { vertical: "middle", horizontal: "center" };
  headerRow.height = 25;

  // 3. Agregar una fila de ejemplo / guía para el usuario
  if (ejemploFila) {
    const rowEjemplo = worksheet.addRow(ejemploFila);
    rowEjemplo.font = { italic: true, color: { argb: "6B7280" } };
  }

  // 4. Generar Buffer y descargar
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

// --- PLANTILLAS ESPECÍFICAS DE EDUGESTIÓN ---

export const plantillaGenerators = {
  // 1. MODO A: PLANILLA UNIFICADA (MAESTRO)
  descargarMaestro: () => {
    const columnas = [
      { header: "Grado", key: "grado", width: 15 },
      { header: "Sección", key: "seccion", width: 12 },
      { header: "Curso", key: "curso", width: 22 },
      { header: "DNI Docente", key: "dniDocente", width: 15 },
      { header: "Nombres Docente", key: "nombresDocente", width: 20 },
      { header: "Apellidos Docente", key: "apellidosDocente", width: 20 },
      { header: "Email Docente", key: "emailDocente", width: 25 },
      { header: "DNI Alumno", key: "dniAlumno", width: 15 },
      { header: "Nombres Alumno", key: "nombresAlumno", width: 20 },
      { header: "Apellidos Alumno", key: "apellidosAlumno", width: 20 },
    ];

    const ejemplo = {
      grado: "1° Secundaria",
      seccion: "A",
      curso: "Matemáticas",
      dniDocente: "12345678",
      nombresDocente: "Juan Carlos",
      apellidosDocente: "Pérez Gómez",
      emailDocente: "j.perez@colegio.edu.pe",
      dniAlumno: "87654321",
      nombresAlumno: "Maria",
      apellidosAlumno: "López Silva",
    };

    return generarExcel(
      "plantilla_carga_unificada",
      "Carga Unificada",
      columnas,
      ejemplo,
    );
  },

  // 2. MODO B - PASO 1: ESTRUCTURA
  descargarEstructura: () => {
    const columnas = [
      { header: "Nivel", key: "nivel", width: 15 },
      { header: "Grado", key: "grado", width: 15 },
      { header: "Sección", key: "seccion", width: 12 },
      { header: "Curso", key: "curso", width: 22 },
    ];

    const ejemplo = {
      nivel: "Secundaria",
      grado: "1° Secundaria",
      seccion: "A",
      curso: "Matemáticas",
    };

    return generarExcel(
      "plantilla_paso1_estructura",
      "Estructura",
      columnas,
      ejemplo,
    );
  },

  // 3. MODO B - PASO 2: DOCENTES
  descargarDocentes: () => {
    const columnas = [
      { header: "DNI", key: "dni", width: 15 },
      { header: "Nombres", key: "nombres", width: 22 },
      { header: "Apellidos", key: "apellidos", width: 22 },
      { header: "Email", key: "email", width: 28 },
      { header: "Teléfono", key: "telefono", width: 16 },
    ];

    const ejemplo = {
      dni: "12345678",
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

  // 4. MODO B - PASO 3: ESTUDIANTES
  descargarEstudiantes: () => {
    const columnas = [
      { header: "DNI Alumno", key: "dniAlumno", width: 15 },
      { header: "Nombres Alumno", key: "nombresAlumno", width: 22 },
      { header: "Apellidos Alumno", key: "apellidosAlumno", width: 22 },
      { header: "Grado", key: "grado", width: 15 },
      { header: "Sección", key: "seccion", width: 12 },
      { header: "DNI Apoderado", key: "dniApoderado", width: 15 },
    ];

    const ejemplo = {
      dniAlumno: "87654321",
      nombresAlumno: "Maria",
      apellidosAlumno: "López Silva",
      grado: "1° Secundaria",
      seccion: "A",
      dniApoderado: "09876543",
    };

    return generarExcel(
      "plantilla_paso3_estudiantes",
      "Estudiantes",
      columnas,
      ejemplo,
    );
  },
};

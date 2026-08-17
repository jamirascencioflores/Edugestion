// src/utils/exportarMorososExcel.js
import ExcelJS from "exceljs";

const obtenerPesoGrado = (texto = "") => {
  const str = texto.toLowerCase();
  let nivelPeso = 400;

  if (
    str.includes("inicial") ||
    str.includes("kinder") ||
    str.includes("jardín") ||
    str.includes("jardin")
  ) {
    nivelPeso = 100;
  } else if (str.includes("primaria")) {
    nivelPeso = 200;
  } else if (str.includes("secundaria")) {
    nivelPeso = 300;
  }

  const matchNumero = str.match(/\d+/);
  const numeroGrado = matchNumero ? parseInt(matchNumero[0], 10) : 99;

  return nivelPeso + numeroGrado;
};

export const generarExcelMorosidad = async (morosos = []) => {
  if (!morosos || morosos.length === 0) {
    throw new Error("No hay registros para exportar.");
  }

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "EduGestión";
  workbook.created = new Date();

  const columnasAula = [
    { header: "N°", key: "index", width: 6 },
    { header: "DNI Estudiante", key: "dni", width: 15 },
    { header: "Estudiante", key: "nombreEstudiante", width: 32 },
    { header: "Meses Deuda", key: "mesesAtrasados", width: 14 },
    { header: "Conceptos Pendientes", key: "conceptos", width: 30 },
    { header: "Total Deuda (S/)", key: "montoTotalDeuda", width: 18 },
    { header: "Apoderado", key: "nombreApoderado", width: 28 },
    { header: "Teléfono", key: "telefonoApoderado", width: 18 },
  ];

  const estilizarEncabezado = (row, colorFondo = "6366F1") => {
    row.font = { bold: true, color: { argb: "FFFFFF" }, size: 11 };
    row.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: colorFondo },
    };
    row.alignment = { vertical: "middle", horizontal: "center" };
    row.height = 24;
  };

  const grupos = morosos.reduce((acc, curr) => {
    const clave = curr.gradoSeccion || "Sin Asignar";
    if (!acc[clave]) acc[clave] = [];
    acc[clave].push(curr);
    return acc;
  }, {});

  const gruposOrdenados = Object.entries(grupos).sort(([gradoA], [gradoB]) => {
    const pesoA = obtenerPesoGrado(gradoA);
    const pesoB = obtenerPesoGrado(gradoB);

    if (pesoA !== pesoB) return pesoA - pesoB;
    return gradoA.localeCompare(gradoB, "es", { numeric: true });
  });

  const resumenSheet = workbook.addWorksheet("Resumen General");
  resumenSheet.columns = [
    { header: "N°", key: "index", width: 6 },
    { header: "Grado y Sección", key: "gradoSeccion", width: 32 },
    { header: "Cant. Alumnos Morosos", key: "totalAlumnos", width: 22 },
    { header: "Deuda Acumulada (S/)", key: "totalDeuda", width: 22 },
  ];
  estilizarEncabezado(resumenSheet.getRow(1), "1E293B");

  let totalGeneralDeuda = 0;
  let totalGeneralMorosos = 0;

  gruposOrdenados.forEach(([gradoNombre, alumnos], idx) => {
    const deudaGrado = alumnos.reduce(
      (sum, a) => sum + Number(a.montoTotalDeuda || 0),
      0,
    );
    totalGeneralDeuda += deudaGrado;
    totalGeneralMorosos += alumnos.length;

    resumenSheet.addRow({
      index: idx + 1,
      gradoSeccion: gradoNombre,
      totalAlumnos: alumnos.length,
      totalDeuda: deudaGrado.toFixed(2),
    });
  });

  const filaTotal = resumenSheet.addRow({
    index: "",
    gradoSeccion: "TOTAL GENERAL",
    totalAlumnos: totalGeneralMorosos,
    totalDeuda: totalGeneralDeuda.toFixed(2),
  });
  filaTotal.font = { bold: true, color: { argb: "991B1B" } };

  gruposOrdenados.forEach(([gradoNombre, alumnos]) => {
    const nombreHoja = gradoNombre.replace(/[\\/*?:[\]"]/g, "").slice(0, 30);

    const sheet = workbook.addWorksheet(nombreHoja);
    sheet.columns = columnasAula;
    estilizarEncabezado(sheet.getRow(1), "4F46E5");

    const alumnosOrdenados = [...alumnos].sort((a, b) =>
      a.nombreEstudiante.localeCompare(b.nombreEstudiante, "es"),
    );

    let subtotalAula = 0;

    alumnosOrdenados.forEach((item, index) => {
      subtotalAula += Number(item.montoTotalDeuda || 0);
      sheet.addRow({
        index: index + 1,
        dni: item.dni,
        nombreEstudiante: item.nombreEstudiante,
        mesesAtrasados: item.mesesAtrasados,
        conceptos: item.mesesPendientes?.join(", ") || "Pensión",
        montoTotalDeuda: Number(item.montoTotalDeuda || 0).toFixed(2),
        nombreApoderado: item.nombreApoderado || "Sin asignar",
        telefonoApoderado: item.telefonoApoderado || "Sin registrar",
      });
    });

    const totalRow = sheet.addRow({
      index: "",
      dni: "",
      nombreEstudiante: "",
      mesesAtrasados: "",
      conceptos: "TOTAL AULA:",
      montoTotalDeuda: subtotalAula.toFixed(2),
      nombreApoderado: "",
      telefonoApoderado: "",
    });
    totalRow.font = { bold: true };
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Reporte_Morosidad_Aulas_${new Date().toISOString().slice(0, 10)}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

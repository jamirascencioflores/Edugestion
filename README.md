# 🎓 EduGestión - SaaS de Gestión Escolar Integral

> Plataforma SaaS multi-tenant diseñada para digitalizar la administración académica, financiera y la comunicación en instituciones educativas de nivel básico regular.

---

## 📌 Visión General

**EduGestión** resuelve la fragmentación operativa en los colegios integrando en un único ecosistema la gestión directiva, el trabajo pedagógico docente y el seguimiento familiar. Su arquitectura desacoplada y multi-tenant garantiza el aislamiento estricto de datos por colegio (`X-Colegio-Id`) y una experiencia optimizada para dispositivos móviles y de escritorio.

---

## 🚀 Módulos del Sistema

### 1. 🏛️ Panel del Director & Gestión Académica
- **Métricas Ejecutivas:** Visualización de KPIs de matrícula, niveles académicos y estado operativo en tiempo real.
- **Gestión Estructural:** Administración de Ciclos Escolares, Grados, Secciones, Cursos y Asignaciones Docentes.
- **Control de Periodos:** Apertura, cierre y autogeneración de bimestres/trimestres con bloqueo automático de modificaciones extemporáneas.
- **Reportes Consolidados:** Exportación de nóminas, actas y sincronización retroactiva de estudiantes.

### 2. 👩‍🏫 Espacio del Docente (Módulo Académico)
- **Dashboard de Clases:** Métricas precisas de alumnos matriculados y cálculo dinámico de avance evaluativo por aula y periodo activo.
- **Planilla de Calificaciones Híbrida:** 
  - **Escritorio:** Tabla de navegación rápida tipo hoja de cálculo con columnas fijas y atajos de teclado (`Enter` / flechas).
  - **Móvil:** Formato de tarjetas táctiles de alta accesibilidad para el registro ágil en el aula.
- **Evaluación Adaptable:** Soporte nativo para la escala oficial cualitativa **CNEB (AD, A, B, C)** con cálculo de niveles de logro, conclusiones descriptivas y compatibilidad con el sistema **vigesimal (0 - 20)**.
- **Persistencia Flexible:** Guardado masivo por lote (`/masivo`) y eliminación controlada de notas individuales vía API REST (`DELETE`).
- **Generación de Boletas:** Emisión de reportes de evaluación por estudiante en formato PDF.

### 3. 💳 Finanzas Escolares
- **Gestión de Pensiones:** Registro y control de cobros recurrentes de matrículas y mensualidades.
- **Reportes de Morosidad:** Identificación preventiva de estados de cuenta y saldos pendientes por grado y sección.
- **Facturación Electrónica:** Estructura preparada para la emisión y trazabilidad de comprobantes de pago.

### 4. 👨‍👩‍👧 Portal de Padres y Familias
- **Seguimiento Académico:** Consulta en línea de libretas de notas oficiales y estado evaluativo por bimestre.
- **Estado de Cuenta Transparente:** Monitoreo de pagos realizados y compromisos financieros pendientes.
- **Canal de Comunicación:** Acceso centralizado a circulares, avisos institucionales y contacto con el colegio.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnologías |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, Axios, SweetAlert2, Sonner |
| **Backend** | Spring Boot 3, Java 17+, Spring Data JPA, Spring Validation, Lombok |
| **Arquitectura** | Arquitectura Hexagonal / Puertos y Adaptadores, SaaS Multi-Tenant |
| **Base de Datos** | PostgreSQL |
| **Reportes** | iText / OpenPDF para generación de boletas |

---

## 📐 Arquitectura del Backend (Microservicio Académico)

El microservicio backend implementa **Arquitectura Hexagonal (Ports & Adapters)** garantizando la independencia de la lógica de negocio frente a frameworks y bases de datos:

```text
com.omnis.saas.academico
├── application.services        # Casos de uso orquestadores
├── domain
│   ├── event                   # Eventos del dominio (ej. AlumnoRetiradoEvent)
│   ├── model                   # Entidades puras (Calificacion, Periodo, Estudiante, etc.)
│   └── ports                   # Interfaces de entrada (UseCases) y salida (Repositories)
└── infrastructure
    ├── adapters
    │   ├── in.web              # Controladores REST y DTOs de request/response
    │   └── out.persistence     # Entidades JPA y Repositorios Spring Data
    └── config.tenant           # Contexto multi-tenant (TenantContext / X-Colegio-Id)

```
---

## ⚙️ Instalación y Despliegue Local

### Requisitos Previos
- Node.js (v18+)
- Java JDK 17+
- PostgreSQL (v14+)
- Maven

### 1. Configurar Backend (Spring Boot)
```bash
# Clonar repositorio
git clone [https://github.com/jamirascencio/edugestion-backend.git](https://github.com/jamirascencio/edugestion-backend.git)
cd edugestion-backend

# Configurar credenciales de PostgreSQL en src/main/resources/application.yml
# Iniciar la aplicación
./mvnw spring-boot:run
```

### 2. Configurar Frontend (React)
```bash
# Clonar repositorio frontend
git clone [https://github.com/tu-usuario/edugestion-frontend.git](https://github.com/tu-usuario/edugestion-frontend.git)
cd edugestion-frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## 📄 Licencia

Este proyecto se distribuye bajo la licencia **MIT**. Desarrollado con fines educativos y de transformación digital para instituciones escolares.

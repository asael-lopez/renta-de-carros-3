# 🚗 Santa Lucía Alquiler — Plataforma de Renta de Vehículos (Fase 3)

Sistema integral de alquiler de vehículos con arquitectura frontend basada en HTML5 semántico, CSS3 responsive, JavaScript Vanilla y persistencia en tiempo real mediante `localStorage`.

Repositorio oficial: [https://github.com/asael-lopez/renta-de-carros-](https://github.com/asael-lopez/renta-de-carros-)

---

## 📋 Resumen de Cumplimiento de Criterios (Evaluación Fase 3)

| # | Requisito / Criterio | Estado | Detalle de Implementación |
|---|---|:---:|---|
| **1** | **Estructura HTML5 y CSS3** | ✅ CUMPLE | 100% etiquetas semánticas (`<header>`, `<nav>`, `<main>`, `<section>`, `<aside>`, `<footer>`) en todas las vistas, incluyendo `login-registro.html`. |
| **2** | **Diseño Responsive con Framework** | ✅ CUMPLE | Tailwind CSS integrado de forma consistente en `index.html`, `autos.html` y `dashboard.html`. Bootstrap en login. Totalmente responsive en móviles, tablets y desktops. |
| **3** | **Lógica de Negocio en JavaScript** | ✅ CUMPLE | Filtros dinámicos por tipo, pasajeros, transmisión y rango de precios. Buscador en tiempo real. Flujo completo de "Realizar una reserva" con cálculo automático de días, tarifas, extras y total. |
| **4** | **Autenticación y Sesión con localStorage** | ✅ CUMPLE | Sesión activa guardada y validada en `localStorage`. Control de acceso y redirección en páginas protegidas. |
| **5** | **Vistas Diferenciadas por Roles** | ✅ CUMPLE | Roles `admin` y `cliente` guardados en el registro. Vistas y paneles diferenciados con selector de rol para pruebas. |
| **6** | **Validación de Entradas en Formularios** | ✅ CUMPLE | Validación estricta en Registro, Login, Edición de Perfil (nombre no vacío, formato de teléfono válido) y Filtros de Precio (`Min <= Max`). |
| **7** | **Ramas por Alumno y Colaboradores** | ✅ CUMPLE | Ramas dedicadas para cada miembro del equipo (`asael-desarrollo`, `arnulfo-gestion`, `steven-navegacion`). |
| **8** | **Despliegue GitHub Pages / Netlify / Vercel** | ✅ CUMPLE | Redirección en la raíz para evitar error 404 en GitHub Pages. Configuraciones listas en `vercel.json` y `netlify.toml`. |
| **9** | **Login con Validación de Credenciales** | ✅ CUMPLE | Verificación obligatoria contra usuarios registrados en `localStorage`: rechaza correos no registrados y valida contraseña. |
| **10** | **Dashboard con Información Relevante** | ✅ CUMPLE | Métricas calculadas en tiempo real a partir del CRUD (flota total, reservas activas, ingresos, eficiencia, puntos). |
| **11** | **Módulo de Gestión (CRUD)** | ✅ CUMPLE | CRUD completo de **Flota** (Crear, Listar, Editar, Eliminar) y CRUD completo de **Reservas** persistidos en `localStorage`. |
| **12** | **Navegación Funcional entre Vistas** | ✅ CUMPLE | Enlaces sin hashes rotos (`#`). Modales informativos para Oficinas, Empresa y Servicios. Botón "Volver al inicio" en login. |

---

## 🔑 Cuentas de Acceso Preconfiguradas (Evaluación Docente)

Para facilitar la revisión inmediata, el sistema cuenta con cuentas ya registradas con contraseñas seguras y roles específicos:

### 👑 Cuenta Administrador
- **Correo:** `admin@santalucia.com`
- **Contraseña:** `admin123`
- **Rol:** `ADMIN` (Acceso al CRUD de flota, CRUD global de reservas, métricas financieras y eficiencia).

### 🚗 Cuenta Cliente
- **Correo:** `cliente@santalucia.com`
- **Contraseña:** `cliente123`
- **Rol:** `CLIENTE` (Acceso a reservas propias, acumulación de puntos de fidelidad y cancelación).

*(También puedes crear cualquier cuenta nueva desde el formulario de Registro seleccionando el rol deseado).*

---

## 📁 Estructura del Proyecto

```text
renta-de-carros--fase3/
├── index.html                   # Redirección raíz para GitHub Pages (elimina 404)
├── vercel.json                  # Configuración para despliegue en Vercel
├── netlify.toml                 # Configuración para despliegue en Netlify
├── README.md                    # Documentación técnica completa
└── renta-carros-santa-lucia/    # Aplicación principal
    ├── index.html               # Página de inicio / Landing
    ├── autos.html               # Catálogo de flota, filtros, buscador y reservas
    ├── login-registro.html      # Acceso y registro con validación y roles
    ├── dashboard.html           # Panel de control con métricas dinámicas y CRUD
    ├── reportes.html            # Gráficas estadísticas con Chart.js
    ├── css/
    │   ├── styles.css           # Estilos base y temas
    │   ├── autos.css            # Estilos del catálogo, filtros y modales de reserva
    │   └── reportes.css         # Estilos del módulo de reportes
    ├── js/
    │   ├── app-data.js          # Gestor central de datos (localStorage CRUD y sesión)
    │   ├── script.js            # Lógica de interfaz, filtros, reservas y validaciones
    │   └── reportes.js          # Lógica de reportes y gráficas Chart.js
    └── fotos/                   # Recursos visuales y vehículos
```

---

## 🚀 Despliegue en GitHub Pages (Paso a Paso)

1. Ingresa a tu repositorio en GitHub: `https://github.com/asael-lopez/renta-de-carros-`
2. Ve a la pestaña **Settings** (Configuración) &rarr; sección lateral **Pages**.
3. En **Build and deployment** &rarr; **Source**:
   - Selecciona **Deploy from a branch**.
   - Branch: `main` / Folder: `/ (root)`.
   - Haz clic en **Save**.
4. ¡Listo! En 1 a 2 minutos tu sitio estará en vivo en:
   `https://asael-lopez.github.io/renta-de-carros-/`

---

## 🌿 Gestión de Ramas de Trabajo por Alumno

Para mantener el trabajo colaborativo organizado conforme a la rúbrica:

```bash
# Rama del alumno Asael López (CRUD y Lógica Central)
git checkout -b asael-desarrollo
git push -u origin asael-desarrollo

# Rama del alumno Arnulfo Henríquez (Autenticación y Sesión)
git checkout -b arnulfo-gestion
git push -u origin arnulfo-gestion

# Rama del alumno Steven Aparicio (Navegación y Estructura)
git checkout -b steven-navegacion
git push -u origin steven-navegacion
```

---

## 🛠️ Tecnologías y Librerías Utilizadas

- **HTML5:** Marcado semántico, formularios nativos, accesibilidad ARIA.
- **CSS3:** Custom Properties (variables CSS), Grid Layout, Flexbox, Media Queries responsive.
- **Frameworks CSS:** Tailwind CSS (diseño moderno y utilitario), Bootstrap 5.3 (módulo de autenticación).
- **JavaScript (ES6+ Vanilla):** Manejo del DOM, LocalStorage API, validación de formularios mediante expresiones regulares, gestión de eventos asíncronos.
- **Chart.js:** Visualización interactiva de datos y reportes de rendimiento de flota.
- **FontAwesome 6:** Iconografía profesional.

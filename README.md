# FerreControl 🛠️

**Plataforma web de gestión y ventas para una ferretería.**

FerreControl es una aplicación full stack desarrollada para facilitar la consulta de productos y la administración de un inventario de ferretería.

El proyecto permite explorar un catálogo de productos y proporciona herramientas administrativas para gestionar la información del inventario.

## Demo y código fuente

- **Aplicación publicada:** https://web-project-ferrecontrol.vercel.app
- **Repositorio GitHub:** https://github.com/cazador0587/web_project_ferrecontrol
- **API pública (estado del servidor):** https://ferrecontrol-api.onrender.com/api/health

> El backend utiliza el plan gratuito de Render, por lo que la primera solicitud puede tardar mientras se activa el servicio.

## Tecnologías utilizadas

### Frontend

- React
- Vite
- JavaScript
- HTML5
- CSS3

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- Autenticación mediante JWT
- bcryptjs para el manejo seguro de contraseñas

### Despliegue

- GitHub: control de versiones y alojamiento del código fuente.
- Vercel: publicación del frontend.
- Render: alojamiento del backend.
- MongoDB Atlas: base de datos en la nube.

## Funcionalidades

### Catálogo público

- Visualización de productos.
- Consulta de información del catálogo.
- Organización de productos por categorías.

### Administración

- Inicio de sesión de administrador.
- Consulta de información de productos.
- Edición de productos.
- Actualización de inventario con persistencia en la base de datos.

### Estructura de datos

El backend contempla modelos para usuarios, productos, categorías, carritos y pedidos.

## Arquitectura

El proyecto utiliza una arquitectura separada en tres componentes:

1. **Frontend:** interfaz de usuario desarrollada con React y Vite.
2. **Backend:** API REST desarrollada con Node.js y Express.
3. **Base de datos:** MongoDB Atlas, utilizada para almacenar la información de la aplicación.

La interfaz se comunica con la API mediante solicitudes HTTP. El backend procesa las operaciones y accede a la base de datos mediante Mongoose.

## Estructura general del proyecto

```text
web_project_ferrecontrol/
├── backend/
│   ├── config/
│   ├── models/
│   ├── scripts/
│   ├── tests/
│   └── server.js
├── frontend/
│   └── src/
└── README.md
```

*La estructura muestra los directorios principales y no todos los archivos del repositorio.*

## Instalación local

### Requisitos

- Node.js y npm.
- Una base de datos MongoDB accesible.
- Git.

### 1. Clonar el repositorio

```bash
git clone https://github.com/cazador0587/web_project_ferrecontrol.git
cd web_project_ferrecontrol
```

### 2. Configurar el backend

```bash
cd backend
npm install
```

Crear un archivo `.env` dentro de `backend/` con las variables correspondientes a la configuración local:

```env
MONGODB_URI=tu_cadena_de_conexion
JWT_SECRET=tu_clave_secreta
FRONTEND_URL=http://localhost:5173
```

Iniciar el servidor:

```bash
npm start
```

### 3. Configurar el frontend

Desde otra terminal:

```bash
cd frontend
npm install
```

Crear un archivo `.env` dentro de `frontend/`:

```env
VITE_API_URL=http://localhost:3001/api
```

Iniciar la aplicación:

```bash
npm run dev
```

Abrir la dirección local que indique Vite.

**Importante:** los archivos `.env` contienen configuración privada y no deben publicarse en GitHub. Nunca se deben incluir contraseñas reales, tokens ni cadenas de conexión privadas en la documentación.

## Pruebas realizadas

Durante la preparación del despliegue se realizaron pruebas automatizadas del backend y comprobaciones manuales de la aplicación publicada.

Se verificó:

- Conexión del backend con MongoDB Atlas.
- Visualización del catálogo público.
- Inicio de sesión con una cuenta administradora.
- Consulta de productos desde el panel administrativo.
- Modificación y persistencia del inventario.
- Restauración del inventario después de la prueba.

## Resultados

La aplicación se encuentra desplegada y permite consultar un catálogo inicial de 8 categorías y 16 productos.

Las funciones de consulta y actualización del inventario fueron verificadas utilizando la aplicación publicada y la base de datos en la nube.

## Mejoras futuras

- Ampliar las pruebas de los procesos de carrito y pedidos.
- Revisar y actualizar dependencias con advertencias de seguridad.
- Profundizar en las pruebas de permisos y control de acceso.
- Mejorar la experiencia de uso en dispositivos móviles.
- Evaluar el rendimiento ante un mayor volumen de usuarios y productos.

## Aprendizajes

Este proyecto permitió aplicar conocimientos de desarrollo frontend y backend, diseño de APIs, modelado de datos, autenticación y despliegue en servicios en la nube.

Uno de los principales retos fue integrar correctamente React, Express y MongoDB Atlas en un entorno de producción.

## Autor

Proyecto personal desarrollado como parte de mi portafolio de desarrollo web.
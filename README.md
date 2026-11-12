# NexaLearn Frontend

Interfaz web de NexaLearn. Permite registrarse, iniciar sesión, ver cursos, realizar pagos con PayPal y acceder al panel administrativo.

## Tecnologías

- React
- TypeScript
- Vite
- Zustand

## Requisitos

- Node.js 20 o superior
- La API de NexaLearn en ejecución

## Ejecutar de forma local

Instala las dependencias:

```powershell
npm install
```

Crea un archivo `.env` a partir de `.env.example` y agrega la dirección de la API:

```env
VITE_API_URL=https://localhost:7193
```

Inicia el proyecto:

```powershell
npm run dev
```

Abre:

```text
http://localhost:5173
```

## Comandos útiles

```powershell
# Iniciar el proyecto
npm run dev

# Crear la versión para publicar
npm run build
```

## Carpetas principales

| Carpeta | Uso |
| --- | --- |
| `src/pages` | Pantallas de inicio, login, registro, cursos, pagos y administración. |
| `src/components` | Menú, pie de página y layouts reutilizables. |
| `src/services` | Conexión con la API. |
| `src/store` | Sesión e información global del usuario. |
| `src/types` | Modelos usados en el frontend. |
| `public` | Archivos públicos y configuración inicial de la API. |

## Publicar con Docker

El proyecto incluye un `Dockerfile` para publicar el frontend.

La única variable necesaria es:

```env
VITE_API_URL=https://tu-api.com
```

El contenedor escucha por el puerto `80`.

Al publicar, la API también debe permitir la URL del frontend:

```env
Cors__FrontendUrl=https://tu-frontend.com
```


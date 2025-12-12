Grupo n°16

**Branco Abalos** - 21619393-8 - branco.abalos@alumnos.ucn.cl - C2
**Cristobal Avalos** - 21624731-0 - cristobal.avalos01@alumnos.ucn.cl - C1
**Ignacio García** - 21664915-K - ignacio.garcia02@alumnos.ucn.cl - C2
**Pablo López** - 21518678-4 - pablo.lopez01@alumnos.ucn.cl - C2

Descripción del Proyecto

**Game Hub** es una aplicación web móvil desarrollada con Next.js que permite a los usuarios gestionar y visualizar su colección de videojuegos. La aplicación integra una base de datos relacional (PostgreSQL) con Prisma ORM, implementa Redux Toolkit para gestión de estado global y utiliza Chart.js para visualizar datos mediante gráficos interactivos.



Instalación y Ejecución

Requisitos Previos
- Node.js >= 18.0.0
- npm o yarn
- Git

Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/Pabluntt/Lab3WebMovil.git
cd Lab3WebMovil/my-app
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
Crear archivo `.env` en el directorio `my-app/`:
```env
# Base de datos PostgreSQL
DATABASE_URL=postgresql://usuario:contraseña@host:puerto/base?sslmode=require

# IGDB API (Opcional - solo si usas el seed)
IGDB_CLIENT_ID=tu_client_id
IGDB_CLIENT_SECRET=tu_secret
IGDB_ACCESS_TOKEN=tu_access_token
```

4. **Configurar la base de datos**
```bash
# Generar cliente de Prisma
npm run prisma:generate

# Sincronizar esquema con BD (sin seed)
npm run prisma:push
```

5. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

6. **Abrir en navegador**
```
http://localhost:3000/games
```
```
http://localhost:3000/games/...(id del juego)
```
```
http://localhost:3000/dashboard
```


API Endpoints

Games
| Método | Endpoint | Descripción |
|--------|----------|------------|
| GET | `/api/games` | Obtener todos los juegos |
| POST | `/api/games` | Crear nuevo juego |
| GET | `/api/games/[id]` | Obtener juego por ID |
| PUT | `/api/games/[id]` | Actualizar juego |
| DELETE | `/api/games/[id]` | Eliminar juego |


# Guía de Deployment

## Base de Datos: Railway

1. Ve a https://railway.app
2. Crea una cuenta y haz login
3. Crea un nuevo proyecto
4. Agrega un servicio PostgreSQL
5. Copia la `DATABASE_URL`

## Backend: Vercel o Railway

### Opción 1: Vercel (Recomendado)

1. En la carpeta `server/`, ejecuta:
   ```bash
   vercel
   ```
2. Sigue los pasos de autenticación
3. Cuando te pida las variables de entorno, agrega:
   - `DATABASE_URL`: (De Railway)
   - `ADMIN_PASSWORD`: Tu contraseña admin

### Opción 2: Railway

1. Conecta tu repositorio a Railway
2. Crea un servicio Node.js
3. Conecta el PostgreSQL
4. Railway automáticamente asigna la `DATABASE_URL`
5. Agrega `ADMIN_PASSWORD` en las variables de entorno

## Frontend: Vercel

1. En la raíz del proyecto, ejecuta:
   ```bash
   vercel
   ```
2. Cuando te pida las variables de entorno, agrega:
   - `REACT_APP_API_URL`: URL de tu backend (ej: https://tu-backend.vercel.app)

## Variables de Entorno

### Backend (Railway/Vercel)
- `DATABASE_URL`: Connection string de PostgreSQL
- `ADMIN_PASSWORD`: Contraseña admin personalizada
- `NODE_ENV`: production

### Frontend (Vercel)
- `REACT_APP_API_URL`: URL base del backend

## Testing Local

1. Instala PostgreSQL localmente o usa Docker:
   ```bash
   docker run --name agencia-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
   ```

2. En `server/.env.local`:
   ```
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/agencia
   ADMIN_PASSWORD=admin123
   NODE_ENV=development
   ```

3. Ejecuta el backend:
   ```bash
   cd server
   npm run dev
   ```

4. En otra terminal, ejecuta el frontend:
   ```bash
   npm run dev
   ```

5. Abre http://localhost:5173

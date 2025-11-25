# Guía de Configuración de Google Calendar Service Account

Esta guía explica cómo configurar Google Calendar como fuente de verdad para el módulo de Programación Laboral.

## Requisitos Previos

- Cuenta de Google Cloud Platform
- Acceso a Google Calendar API
- Permisos para crear Service Accounts

## Paso 1: Crear un Proyecto en Google Cloud Platform

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Anota el **Project ID** para referencia futura

## Paso 2: Habilitar Google Calendar API

1. En el menú lateral, ve a **APIs & Services** > **Library**
2. Busca "Google Calendar API"
3. Haz clic en **Enable** para habilitar la API

## Paso 3: Crear una Service Account

1. Ve a **APIs & Services** > **Credentials**
2. Haz clic en **Create Credentials** > **Service Account**
3. Completa el formulario:
   - **Service account name**: `conv3rtech-calendar` (o el nombre que prefieras)
   - **Service account ID**: Se genera automáticamente
   - **Description**: "Service Account para gestión de calendarios laborales"
4. Haz clic en **Create and Continue**
5. En **Grant this service account access to project**, puedes omitir este paso por ahora
6. Haz clic en **Done**

## Paso 4: Crear y Descargar la Clave JSON

1. En la lista de Service Accounts, haz clic en la que acabas de crear
2. Ve a la pestaña **Keys**
3. Haz clic en **Add Key** > **Create new key**
4. Selecciona **JSON** como formato
5. Haz clic en **Create**
6. El archivo JSON se descargará automáticamente
7. **IMPORTANTE**: Guarda este archivo de forma segura. Contiene credenciales sensibles.

## Paso 5: Compartir Calendarios con la Service Account

Para que la Service Account pueda gestionar eventos, necesitas compartir los calendarios con ella:

### Opción A: Usar un Calendario Principal Compartido

1. Crea un calendario en Google Calendar (o usa uno existente)
2. Ve a la configuración del calendario
3. En **Share with specific people**, agrega el email de la Service Account
   - El email tiene el formato: `nombre-service-account@proyecto-id.iam.gserviceaccount.com`
   - Puedes encontrarlo en el archivo JSON descargado (campo `client_email`)
4. Asigna el permiso **Make changes to events** (Editor)
5. Haz clic en **Send**

### Opción B: Usar Calendarios Individuales por Empleado

Si cada empleado tiene su propio calendario:

1. Para cada empleado, comparte su calendario con el email de la Service Account
2. Asigna permiso **Make changes to events**
3. Guarda el `calendarId` de cada calendario (puede ser el email del calendario o el ID)

## Paso 6: Configurar Variables de Entorno

### Desarrollo Local

1. Coloca el archivo JSON descargado en la raíz del proyecto backend:
   ```
   BackEnd_Conv3rTech/google-service-account.json
   ```

2. Agrega al archivo `.env`:
   ```env
   # Google Calendar Configuration
   GOOGLE_SERVICE_ACCOUNT_JSON=google-service-account.json
   GOOGLE_CALENDAR_ID=primary
   # O el ID del calendario compartido (puede ser un email)
   # GOOGLE_CALENDAR_ID=tu-calendario@example.com
   ```

### Producción (Render, Heroku, etc.)

**Opción 1: Variable de Entorno con JSON completo**

1. Lee el contenido completo del archivo JSON
2. En tu plataforma de hosting, crea una variable de entorno:
   ```
   GOOGLE_SERVICE_ACCOUNT_CREDENTIALS={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
   ```
   - **IMPORTANTE**: Escapa las comillas dobles correctamente o usa el formato JSON en una sola línea

**Opción 2: Usar archivo en el servidor**

1. Sube el archivo JSON al servidor en una ubicación segura
2. Configura la variable de entorno:
   ```
   GOOGLE_SERVICE_ACCOUNT_PATH=/ruta/segura/google-service-account.json
   ```

3. También configura:
   ```
   GOOGLE_CALENDAR_ID=primary
   # O el ID del calendario compartido
   ```

## Paso 7: Verificar la Configuración

1. Inicia el servidor backend
2. Verifica que no haya errores de inicialización de Google Calendar
3. Prueba crear un evento desde el frontend
4. Verifica que el evento aparezca en Google Calendar

## Solución de Problemas

### Error: "No se pudo inicializar Google Calendar"

- Verifica que el archivo JSON esté en la ubicación correcta
- Verifica que las variables de entorno estén configuradas correctamente
- Asegúrate de que el archivo JSON tenga el formato correcto

### Error: "Insufficient Permission" o "Forbidden"

- Verifica que la Service Account tenga acceso al calendario
- Asegúrate de haber compartido el calendario con el email de la Service Account
- Verifica que el permiso sea "Make changes to events" (Editor)

### Error: "Calendar not found"

- Verifica que el `GOOGLE_CALENDAR_ID` sea correcto
- Si usas un email como calendarId, asegúrate de que el calendario esté compartido
- Prueba con `primary` para usar el calendario principal

### Los eventos no aparecen en Google Calendar

- Verifica que la Service Account tenga permisos de escritura
- Revisa los logs del backend para ver errores específicos
- Verifica que el calendario esté compartido correctamente

## Estructura del Archivo JSON

El archivo JSON de Service Account tiene esta estructura:

```json
{
  "type": "service_account",
  "project_id": "tu-proyecto-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "nombre@proyecto-id.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

## Seguridad

- **NUNCA** subas el archivo JSON a repositorios públicos
- Agrega `google-service-account.json` al `.gitignore`
- Usa variables de entorno en producción
- Rota las credenciales periódicamente
- Limita los permisos de la Service Account al mínimo necesario

## Mapeo de Empleados a Calendarios (Opcional)

Si quieres que cada empleado tenga su propio calendario:

1. Crea un campo `calendarId` en la tabla `usuarios` (opcional)
2. Al crear eventos, el sistema buscará el `calendarId` del usuario
3. Si no existe, usará el `GOOGLE_CALENDAR_ID` por defecto

Ejemplo de migración SQL (opcional):

```sql
ALTER TABLE usuarios ADD COLUMN calendarId VARCHAR(255) NULL;
```

Luego, actualiza los usuarios con sus calendarIds correspondientes.

## Referencias

- [Google Calendar API Documentation](https://developers.google.com/calendar/api)
- [Service Accounts Guide](https://cloud.google.com/iam/docs/service-accounts)
- [Google Calendar API Node.js Client](https://github.com/googleapis/google-api-nodejs-client)


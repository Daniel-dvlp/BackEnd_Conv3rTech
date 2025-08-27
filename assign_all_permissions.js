const axios = require("axios");

// Configuración
const BASE_URL = "http://localhost:3006/api";
let authToken = "";

// Colores para la consola
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Función para hacer peticiones HTTP
async function makeRequest(method, endpoint, data = null, token = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
    };
  }
}

// Login
async function login() {
  log("\n🔐 Iniciando sesión...", "blue");

  const result = await makeRequest("POST", "/auth/login", {
    correo: "admin@conv3rtech.com",
    contrasena: "123456",
  });

  if (result.success) {
    authToken = result.data.data.token;
    log("✅ Login exitoso!", "green");
    return true;
  } else {
    log("❌ Error en login:", "red");
    log(JSON.stringify(result.error, null, 2), "red");
    return false;
  }
}

// Obtener todos los permisos
async function getPermissions() {
  log("\n🔑 Obteniendo permisos...", "blue");

  const result = await makeRequest("GET", "/permissions", null, authToken);

  if (result.success) {
    log(`✅ Permisos obtenidos: ${result.data.data.length}`, "green");
    return result.data.data;
  } else {
    log("❌ Error obteniendo permisos:", "red");
    return [];
  }
}

// Obtener todos los privilegios
async function getPrivileges() {
  log("\n⭐ Obteniendo privilegios...", "blue");

  const result = await makeRequest("GET", "/privileges", null, authToken);

  if (result.success) {
    log(`✅ Privilegios obtenidos: ${result.data.data.length}`, "green");
    return result.data.data;
  } else {
    log("❌ Error obteniendo privilegios:", "red");
    return [];
  }
}

// Crear array de todas las combinaciones de permisos y privilegios
function createAllPermissionsArray(permissions, privileges) {
  const allPermissions = [];

  permissions.forEach((permission) => {
    privileges.forEach((privilege) => {
      allPermissions.push({
        permissionId: permission.id_permiso,
        privilegeId: privilege.id_privilegio,
      });
    });
  });

  return allPermissions;
}

// Asignar todos los permisos al rol Administrador
async function assignAllPermissions(permissions, privileges) {
  log("\n🔗 Asignando todos los permisos al Administrador...", "blue");

  const allPermissions = createAllPermissionsArray(permissions, privileges);

  log(`📊 Total de asignaciones a crear: ${allPermissions.length}`, "yellow");
  log(
    `📋 Permisos: ${permissions.length} | Privilegios: ${privileges.length}`,
    "yellow"
  );

  const result = await makeRequest(
    "POST",
    "/roles/1/permissions/bulk",
    { permissions: allPermissions },
    authToken
  );

  if (result.success) {
    log("✅ Todos los permisos asignados exitosamente!", "green");
    log(`🎯 Rol Administrador (ID: 1) ahora tiene acceso completo`, "green");
    return true;
  } else {
    log("❌ Error asignando permisos:", "red");
    log(JSON.stringify(result.error, null, 2), "red");
    return false;
  }
}

// Verificar permisos asignados
async function verifyPermissions() {
  log("\n👀 Verificando permisos asignados...", "blue");

  const result = await makeRequest(
    "GET",
    "/roles/1/permissions",
    null,
    authToken
  );

  if (result.success) {
    const permissions = result.data.data;
    log(`✅ Permisos verificados: ${permissions.length} asignaciones`, "green");

    // Agrupar por permiso
    const groupedPermissions = {};
    permissions.forEach((perm) => {
      const permName = perm.permiso.nombre_permiso;
      const privName = perm.privilegio.nombre_privilegio;

      if (!groupedPermissions[permName]) {
        groupedPermissions[permName] = [];
      }
      groupedPermissions[permName].push(privName);
    });

    log("\n📋 Resumen de permisos del Administrador:", "blue");
    Object.keys(groupedPermissions).forEach((perm) => {
      log(`  ${perm}: ${groupedPermissions[perm].join(", ")}`, "green");
    });

    return true;
  } else {
    log("❌ Error verificando permisos:", "red");
    return false;
  }
}

// Función principal
async function main() {
  log("🚀 ASIGNANDO TODOS LOS PERMISOS AL ADMINISTRADOR", "bold");
  log("=".repeat(60), "blue");

  try {
    // 1. Login
    const loginSuccess = await login();
    if (!loginSuccess) {
      log("❌ No se pudo hacer login. Deteniendo proceso.", "red");
      return;
    }

    // 2. Obtener permisos
    const permissions = await getPermissions();
    if (permissions.length === 0) {
      log("❌ No se pudieron obtener los permisos.", "red");
      return;
    }

    // 3. Obtener privilegios
    const privileges = await getPrivileges();
    if (privileges.length === 0) {
      log("❌ No se pudieron obtener los privilegios.", "red");
      return;
    }

    // 4. Asignar todos los permisos
    const assignSuccess = await assignAllPermissions(permissions, privileges);
    if (!assignSuccess) {
      log("❌ No se pudieron asignar los permisos.", "red");
      return;
    }

    // 5. Verificar asignación
    await verifyPermissions();

    log("\n🎉 ¡PROCESO COMPLETADO EXITOSAMENTE!", "bold");
    log(
      "El rol Administrador (ID: 1) ahora tiene acceso completo a todos los módulos.",
      "green"
    );
  } catch (error) {
    log("\n❌ Error durante el proceso:", "red");
    log(error.message, "red");
  }
}

// Ejecutar script
main();

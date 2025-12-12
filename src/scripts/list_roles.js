const sequelize = require("../config/database");
const Role = require("../models/auth/Role");

async function listRoles() {
  try {
    await sequelize.authenticate();
    const roles = await Role.findAll();
    console.log("Roles in DB:", JSON.stringify(roles, null, 2));
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

listRoles();

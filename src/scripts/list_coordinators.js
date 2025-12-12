const sequelize = require("../config/database");
const User = require("../models/users/Users");
const Role = require("../models/auth/Role");
require("../models/auth/associations"); // Load associations

async function listCoordinators() {
  try {
    await sequelize.authenticate();
    const coordinators = await User.findAll({
      where: { id_rol: 3 },
      include: [{ model: Role, as: 'rol' }]
    });

    console.log("Found Coordinators:", JSON.stringify(coordinators, null, 2));
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

listCoordinators();

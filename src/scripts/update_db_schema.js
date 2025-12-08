const sequelize = require('../config/database');
const Project = require('../models/projects/Project');

const updateSchema = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    // Alter the table to match the new model definition
    await Project.sync({ alter: true });
    console.log('✅ Project table schema updated (alter: true).');

  } catch (error) {
    console.error('❌ Error updating schema:', error);
  } finally {
    await sequelize.close();
  }
};

updateSchema();

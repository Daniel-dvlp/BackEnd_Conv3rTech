const ProjectService = require('../services/projects/ProjectService');
const sequelize = require('../config/database');

const listProjects = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established.');

    const result = await ProjectService.getAllProjects();
    console.log(`Found ${result.length} projects.`);
    
    if (result.length > 0) {
        console.log('First project:', JSON.stringify(result[0], null, 2));
    }

    // Check specifically for the recently created project (we know it has "Coti 4" in name from previous turns)
    const recent = result.find(p => p.nombre && p.nombre.includes('Coti 4'));
    if (recent) {
        console.log('✅ Found recent project:', JSON.stringify(recent, null, 2));
    } else {
        console.log('❌ Recent project NOT found in getAllProjects result.');
    }

  } catch (error) {
    console.error('❌ Error listing projects:', error);
  } finally {
    await sequelize.close();
  }
};

listProjects();

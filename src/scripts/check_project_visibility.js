
const ProjectService = require("../services/projects/ProjectService");

async function run() {
    try {
        console.log("🔍 Fetching all projects...");
        const projects = await ProjectService.getAllProjects();
        console.log(`✅ Total Projects: ${projects.length}`);
        
        const p33 = projects.find(p => p.id === 33 || p.id_proyecto === 33);
        if (p33) {
            console.log("✅ Project 33 found in the list!");
            console.log("Details:", JSON.stringify(p33, null, 2));
        } else {
            console.error("❌ Project 33 NOT found in the list!");
        }

    } catch (error) {
        console.error("❌ Error:", error);
    }
}

run();

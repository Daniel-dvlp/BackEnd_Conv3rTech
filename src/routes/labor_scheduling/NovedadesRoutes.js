const express = require("express");
const router = express.Router();
const NovedadesController = require("../../controllers/labor_scheduling/NovedadesController");
// GET /api/novedades
router.get("/", NovedadesController.getAllNovedades);

// GET /api/novedades/:novedadId
router.get("/:novedadId", NovedadesController.getNovedadById);

// POST /api/novedades
router.post("/", NovedadesController.createNovedad);

// PUT /api/novedades/:novedadId
router.put("/:novedadId", NovedadesController.updateNovedad);

// DELETE /api/novedades/:novedadId
router.delete("/:novedadId", NovedadesController.deleteNovedad);

module.exports = router;

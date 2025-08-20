const { Service, ServiceCategory } = require('../models');

module.exports = {
  async list(req, res) {
    const where = {};
    if (req.query.categoryId) where.id_categoria_servicio = req.query.categoryId;

    const rows = await Service.findAll({
      where,
      include: [{ model: ServiceCategory, as:'categoria', attributes:['id_categoria_servicio','nombre'] }],
      order:[['id_servicio','ASC']]
    });
    res.json({ ok:true, data: rows });
  },

  async find(req, res) {
    const row = await Service.findByPk(req.params.id, {
      include: [{ model: ServiceCategory, as:'categoria', attributes:['id_categoria_servicio','nombre'] }]
    });
    if (!row) return res.status(404).json({ ok:false, msg:'No encontrado' });
    res.json({ ok:true, data: row });
  },

  async create(req, res) {
    try {
      const row = await Service.create(req.body);
      res.status(201).json({ ok:true, data: row });
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ ok:false, msg:'El nombre del servicio ya existe' });
      }
      return res.status(400).json({ ok:false, msg: err.message });
    }
  },

  async update(req, res) {
    const row = await Service.findByPk(req.params.id);
    if (!row) return res.status(404).json({ ok:false, msg:'No encontrado' });
    try {
      await row.update(req.body);
      res.json({ ok:true, data: row });
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ ok:false, msg:'El nombre del servicio ya existe' });
      }
      return res.status(400).json({ ok:false, msg: err.message });
    }
  },

  async changeStatus(req, res) {
    const row = await Service.findByPk(req.params.id);
    if (!row) return res.status(404).json({ ok:false, msg:'No encontrado' });
    const { estado } = req.body; // 'activo' | 'inactivo'
    await row.update({ estado });
    res.json({ ok:true, data: row });
  },

  async remove(req, res) {
    const row = await Service.findByPk(req.params.id);
    if (!row) return res.status(404).json({ ok:false, msg:'No encontrado' });
    await row.destroy();
    res.json({ ok:true, msg:'Eliminado' });
  }
};

const { Op } = require('sequelize');
const { Appointment } = require('../models');

module.exports = {
  async list(req, res) {
    const rows = await Appointment.findAll({ order:[['id_cita','ASC']] });
    res.json({ ok:true, data: rows });
  },

  async find(req, res) {
    const row = await Appointment.findByPk(req.params.id);
    if (!row) return res.status(404).json({ ok:false, msg:'No encontrado' });
    res.json({ ok:true, data: row });
  },

  async create(req, res) {
    try {
      // (opcional) prevenir duplicado antes de golpear la UNIQUE
      const { id_cliente, fecha_hora, id_usuario } = req.body;
      const dup = await Appointment.findOne({ where: { id_cliente, fecha_hora, id_usuario } });
      if (dup) return res.status(409).json({ ok:false, msg:'Ya existe una cita para ese cliente/usuario en esa fecha' });

      const row = await Appointment.create(req.body);
      res.status(201).json({ ok:true, data: row });
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ ok:false, msg:'Duplicado: (cliente, fecha_hora, usuario)' });
      }
      return res.status(400).json({ ok:false, msg: err.message });
    }
  },

  async update(req, res) {
    const row = await Appointment.findByPk(req.params.id);
    if (!row) return res.status(404).json({ ok:false, msg:'No encontrado' });
    try {
      await row.update(req.body);
      res.json({ ok:true, data: row });
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ ok:false, msg:'Duplicado: (cliente, fecha_hora, usuario)' });
      }
      return res.status(400).json({ ok:false, msg: err.message });
    }
  },

  async changeStatus(req, res) {
    const row = await Appointment.findByPk(req.params.id);
    if (!row) return res.status(404).json({ ok:false, msg:'No encontrado' });
    const { estado } = req.body; // Programada | Completada | Cancelada | Reprogramada
    await row.update({ estado });
    res.json({ ok:true, data: row });
  },

  async remove(req, res) {
    const row = await Appointment.findByPk(req.params.id);
    if (!row) return res.status(404).json({ ok:false, msg:'No encontrado' });
    await row.destroy();
    res.json({ ok:true, msg:'Eliminado' });
  }
};

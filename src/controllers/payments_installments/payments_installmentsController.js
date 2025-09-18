const Service = require('../../services/payments_installments/payments_installmentsServices');

const createPagoAbono = async (req, res) => {
    try {
        const created = await Service.createPagoAbono(req.body);
        return res.status(201).json(created);
    } catch (error) {
        const status = error.statusCode || 400;
        return res.status(status).json({ error: error.message });
    }
};

const getAllPagosAbonos = async (req, res) => {
    try {
        const items = await Service.getAllPagosAbonos();
        return res.status(200).json(items);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const getPagoAbonoById = async (req, res) => {
    try {
        const item = await Service.getPagoAbonoById(req.params.id);
        if (!item) {
            return res.status(404).json({ error: 'Pago/Abono no encontrado' });
        }
        return res.status(200).json(item);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const searchPagosAbonos = async (req, res) => {
    try {
        const items = await Service.searchPagosAbonos(req.params.term);
        return res.status(200).json(items);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const cancelPagoAbono = async (req, res) => {
    try {
        await Service.cancelPagoAbono(req.params.id);
        return res.status(200).json({ success: true });
    } catch (error) {
        const status = error.statusCode || 400;
        return res.status(status).json({ error: error.message });
    }
};

module.exports = {
    createPagoAbono,
    getAllPagosAbonos,
    getPagoAbonoById,
    searchPagosAbonos,
    cancelPagoAbono
};



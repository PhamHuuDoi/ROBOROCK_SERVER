const service = require("../service/pos.service");
const MESSAGES = require('../../../shared/constants/messages');
const success = require('../../../shared/responses/success');

// Lấy danh sách đơn POS
async function getAll(req, res, next) {
  try {
    const result = await service.getAllPosOrders(req.validated);
    res.json(success.create(MESSAGES.POS.GET_ALL_SUCCESS, result));
  } catch (err) {
    next(err);
  }
}

// Lấy chi tiết 1 đơn POS
async function getById(req, res, next) {
  try {
    const result = await service.getPosOrderById(req.params.id);
    res.json(success.create(MESSAGES.POS.GET_SUCCESS, result));
  } catch (err) {
    next(err);
  }
}

// Tạo đơn POS, thanh toán ngay, trừ tồn kho ngay
async function create(req, res, next) {
  try {
    const result = await service.createPosOrder(req.validated, req.user.id);
    res.status(201).json(success.create(MESSAGES.POS.CREATE_SUCCESS, result));
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, create };
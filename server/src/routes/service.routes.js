const express = require('express');
const router = express.Router();
const {
  getServices,
  getServiceById,
  createService,
} = require('../controllers/service.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.get('/', getServices);
router.get('/:id', getServiceById);
router.post('/', protect, adminOnly, createService);

module.exports = router;

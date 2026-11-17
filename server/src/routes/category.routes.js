const express = require('express');
const router = express.Router();
const { getCategories, createCategory } = require('../controllers/category.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.get('/', getCategories);
router.post('/', protect, adminOnly, createCategory);

module.exports = router;

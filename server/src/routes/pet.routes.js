const express = require('express');
const router = express.Router();
const {
  getMyPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
} = require('../controllers/pet.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getMyPets);
router.post('/', protect, createPet);
router.get('/:id', protect, getPetById);
router.put('/:id', protect, updatePet);
router.delete('/:id', protect, deletePet);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  listAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
} = require('../controllers/assets.controller');

router.get('/', listAssets);
router.get('/:id', getAssetById);
router.post('/', createAsset);
router.put('/:id', updateAsset);
router.delete('/:id', deleteAsset);

module.exports = router;

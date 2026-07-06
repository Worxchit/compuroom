const pool = require('../config/db');

async function listAssets(req, res) {
  try {
    const result = await pool.query('SELECT * FROM assets ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAssetById(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM assets WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createAsset(req, res) {
  try {
    const { asset_code, brand, model, cpu, ram, room, status } = req.body;
    if (!asset_code || !brand || !model || !room) {
      return res.status(400).json({ error: 'asset_code, brand, model, room are required' });
    }
    const result = await pool.query(
      `INSERT INTO assets (asset_code, brand, model, cpu, ram, room, status)
       VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, 'active'))
       RETURNING *`,
      [asset_code, brand, model, cpu, ram, room, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'asset_code already exists' });
    }
    res.status(500).json({ error: err.message });
  }
}

async function updateAsset(req, res) {
  try {
    const { id } = req.params;
    const { asset_code, brand, model, cpu, ram, room, status } = req.body;
    const result = await pool.query(
      `UPDATE assets SET
         asset_code = COALESCE($1, asset_code),
         brand = COALESCE($2, brand),
         model = COALESCE($3, model),
         cpu = COALESCE($4, cpu),
         ram = COALESCE($5, ram),
         room = COALESCE($6, room),
         status = COALESCE($7, status)
       WHERE id = $8
       RETURNING *`,
      [asset_code, brand, model, cpu, ram, room, status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteAsset(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM assets WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  listAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
};

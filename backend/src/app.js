const express = require('express');
const cors = require('cors');
const assetsRoutes = require('./routes/assets.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/assets', assetsRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

module.exports = app;

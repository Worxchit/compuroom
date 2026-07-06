CREATE TABLE IF NOT EXISTS assets (
  id SERIAL PRIMARY KEY,
  asset_code VARCHAR(50) UNIQUE NOT NULL,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  cpu VARCHAR(100),
  ram VARCHAR(50),
  room VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'repair', 'disposed')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO assets (asset_code, brand, model, cpu, ram, room, status)
VALUES
  ('PC-001', 'Dell', 'OptiPlex 7090', 'Intel i5-11500', '16GB', 'Lab A101', 'active'),
  ('PC-002', 'HP', 'ProDesk 600 G6', 'Intel i7-10700', '32GB', 'Lab A102', 'repair')
ON CONFLICT (asset_code) DO NOTHING;

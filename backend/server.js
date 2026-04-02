const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

// Create table
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS sayimlar (
      id SERIAL PRIMARY KEY,
      barcode VARCHAR(128) NOT NULL,
      quantity INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS sayim_log (
      id SERIAL PRIMARY KEY,
      sayim_id INTEGER NOT NULL,
      barcode VARCHAR(128) NOT NULL,
      quantity INTEGER NOT NULL,
      deleted_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log("DB ready");
}

// GET - list all
app.get("/api/sayim", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM sayimlar ORDER BY created_at DESC"
  );
  res.json(result.rows);
});

// POST - create
app.post("/api/sayim", async (req, res) => {
  const { barcode, quantity } = req.body;
  if (!barcode || !quantity) {
    return res.status(400).json({ error: "barcode and quantity required" });
  }
  const result = await pool.query(
    "INSERT INTO sayimlar (barcode, quantity) VALUES ($1, $2) RETURNING *",
    [barcode, quantity]
  );
  res.status(201).json(result.rows[0]);
});

// DELETE - remove one (log before delete)
app.delete("/api/sayim/:id", async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    "DELETE FROM sayimlar WHERE id = $1 RETURNING *",
    [id]
  );
  if (result.rowCount === 0) {
    return res.status(404).json({ error: "not found" });
  }
  const deleted = result.rows[0];
  await pool.query(
    "INSERT INTO sayim_log (sayim_id, barcode, quantity) VALUES ($1, $2, $3)",
    [deleted.id, deleted.barcode, deleted.quantity]
  );
  res.json({ deleted: true });
});

// GET - deletion log
app.get("/api/log", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM sayim_log ORDER BY deleted_at DESC"
  );
  res.json(result.rows);
});

const PORT = process.env.PORT || 3001;

initDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

const express = require('express');
const cors = require('cors');
const pool = require('./db'); // Import the database connection pool

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Endpoint to fetch all books
app.get('/books', (req, res) => {
  const sql = 'SELECT * FROM Books';
  pool.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching books:', err.message);
      res.status(500).json({ error: 'Error fetching books' });
      return;
    }
    res.json(results.rows);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

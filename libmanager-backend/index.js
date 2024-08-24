const express = require('express');
const cors = require('cors');
const pool = require('./db'); // Import the correct database connection pool from db.js

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.sendStatus(204); // No Content
});


// Fetch all books
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

// Add a new book
app.post('/books', (req, res) => {
  const { title, author, isbn, genre, publication_year, availability_status, shelf_location } = req.body;
  const sql = `INSERT INTO Books (title, author, isbn, genre, publication_year, availability_status, shelf_location)
               VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
  pool.query(sql, [title, author, isbn, genre, publication_year, availability_status, shelf_location], (err, result) => {
    if (err) {
      console.error('Error adding book:', err.message);
      res.status(500).json({ error: 'Error adding book' });
      return;
    }
    res.status(201).json(result.rows[0]);
  });
});

// Update a book
app.put('/books/:id', (req, res) => {
  const { id } = req.params;
  const { title, author, isbn, genre, publication_year, availability_status, shelf_location } = req.body;
  const sql = `UPDATE Books SET title = $1, author = $2, isbn = $3, genre = $4, publication_year = $5, availability_status = $6, shelf_location = $7 WHERE book_id = $8 RETURNING *`;
  pool.query(sql, [title, author, isbn, genre, publication_year, availability_status, shelf_location, id], (err, result) => {
    if (err) {
      console.error('Error updating book:', err.message);
      res.status(500).json({ error: 'Error updating book' });
      return;
    }
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Book not found' });
    } else {
      res.json(result.rows[0]);
    }
  });
});

// Delete a book
app.delete('/books/:id', (req, res) => {
    const { id } = req.params;  // Extract id from request parameters
    const sql = 'DELETE FROM Books WHERE book_id = $1 RETURNING *';  // SQL query to delete book by id
    pool.query(sql, [id], (err, result) => {  // Execute SQL query
        if (err) {
            console.error('Error deleting book:', err.message);
            res.status(500).json({ error: 'Error deleting book' });
            return;
        }
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Book not found' });  // No book found with the given id
        } else {
            res.json(result.rows[0]);  // Return deleted book
        }
    });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

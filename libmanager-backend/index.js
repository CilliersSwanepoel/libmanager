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
        res.json(result.rows[0]);
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
        res.json(result.rows[0]);
    });
});

// Delete a book
app.delete('/books/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM Books WHERE book_id = $1 RETURNING *';
    pool.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error deleting book:', err.message);
            res.status(500).json({ error: 'Error deleting book' });
            return;
        }
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Book not found' });
        } else {
            res.json(result.rows[0]);
        }
    });
});

// Fetch all users
app.get('/users', (req, res) => {
    const sql = 'SELECT * FROM Users';
    pool.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err.message);
            res.status(500).json({ error: 'Error fetching users' });
            return;
        }
        res.json(results.rows);
    });
});

// Add a new user
app.post('/users', (req, res) => {
    const { first_name, last_name, email, phone_number, address, account_status } = req.body;
    const sql = `INSERT INTO Users (first_name, last_name, email, phone_number, address, account_status)
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    pool.query(sql, [first_name, last_name, email, phone_number, address, account_status], (err, result) => {
        if (err) {
            console.error('Error adding user:', err.message);
            res.status(500).json({ error: 'Error adding user' });
            return;
        }
        res.json(result.rows[0]);
    });
});

// Update a user
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, email, phone_number, address, account_status } = req.body;
    const sql = `UPDATE Users SET first_name = $1, last_name = $2, email = $3, phone_number = $4, address = $5, account_status = $6 WHERE user_id = $7 RETURNING *`;
    pool.query(sql, [first_name, last_name, email, phone_number, address, account_status, id], (err, result) => {
        if (err) {
            console.error('Error updating user:', err.message);
            res.status(500).json({ error: 'Error updating user' });
            return;
        }
        res.json(result.rows[0]);
    });
});

// Delete a user
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM Users WHERE user_id = $1 RETURNING *';
    pool.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error deleting user:', err.message);
            res.status(500).json({ error: 'Error deleting user' });
            return;
        }
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json(result.rows[0]);
        }
    });
});

// Issue Book
app.post('/issue-book', (req, res) => {
    const { bookId, userId, dueDate } = req.body;
    const sql = `INSERT INTO circulation (book_id, user_id, issue_date, due_date, status) VALUES ($1, $2, CURRENT_DATE, $3, 'Checked Out') RETURNING *`;
    pool.query(sql, [bookId, userId, dueDate], (err, result) => {
        if (err) {
            console.error('Error issuing book:', err.message);
            res.status(500).json({ error: 'Error issuing book' });
            return;
        }
        res.json({ message: 'Book issued successfully', data: result.rows[0] });
    });
});

// Return Book
app.post('/return-book', (req, res) => {
    const { bookId, userId } = req.body;
    const sql = `UPDATE circulation SET status = 'Returned', return_date = CURRENT_DATE WHERE book_id = $1 AND user_id = $2 AND status = 'Checked Out' RETURNING *`;
    pool.query(sql, [bookId, userId], (err, result) => {
        if (err) {
            console.error('Error returning book:', err.message);
            res.status(500).json({ error: 'Error returning book' });
            return;
        }
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'No matching record found' });
        } else {
            res.json(result.rows[0]);
        }
    });
});

// Renew Book
app.post('/renew-book', (req, res) => {
    const { bookId, userId } = req.body;
    const sql = `UPDATE circulation SET due_date = due_date + INTERVAL '14 days' WHERE book_id = $1 AND user_id = $2 AND status = 'Checked Out' RETURNING *`;
    pool.query(sql, [bookId, userId], (err, result) => {
        if (err) {
            console.error('Error renewing book:', err.message);
            res.status(500).json({ error: 'Error renewing book' });
            return;
        }
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'No matching record found' });
        } else {
            res.json(result.rows[0]);
        }
    });
});

// Fetch all circulation records
app.get('/circulation', (req, res) => {
    const sql = `
        SELECT c.book_id, b.title, b.author, c.issue_date, c.user_id, u.first_name || ' ' || u.last_name AS user_name, c.due_date
        FROM circulation c
        JOIN books b ON c.book_id = b.book_id
        JOIN users u ON c.user_id = u.user_id
        WHERE c.status = 'Checked Out'
    `;
    pool.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching circulation records:', err.message);
            res.status(500).json({ error: 'Error fetching circulation records' });
            return;
        }
        res.json(results.rows);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
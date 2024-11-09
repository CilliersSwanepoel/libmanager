const express = require('express');
const cors = require('cors');
const pool = require('./db'); // Import the correct database connection pool from db.js
const { sendWelcomeEmail, sendFineNotificationEmail } = require('./mailer');
require('dotenv').config();

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
        const newUser = result.rows[0];
        sendWelcomeEmail(newUser.email, newUser.first_name);
        res.json(newUser);
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
app.post('/return-book', async (req, res) => {
    const { bookId, userId } = req.body;
    const finePerDay = 20; // R20 fine per day

    try {
        // Check if the book is overdue
        const overdueCheckSql = `SELECT due_date FROM circulation WHERE book_id = $1 AND user_id = $2 AND status = 'Checked Out'`;
        const overdueCheckResult = await pool.query(overdueCheckSql, [bookId, userId]);
        if (overdueCheckResult.rowCount === 0) {
            return res.status(404).json({ error: 'No matching record found' });
        }

        const dueDate = new Date(overdueCheckResult.rows[0].due_date);
        const currentDate = new Date();
        const diffTime = currentDate - dueDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 0) {
            const fineAmount = diffDays * finePerDay;
            const fineSql = `INSERT INTO fines (user_id, transaction_id, fine_amount, fine_date, fine_status)
                             VALUES ($1, (SELECT transaction_id FROM circulation WHERE book_id = $2 AND user_id = $3 AND status = 'Checked Out'), $4, CURRENT_DATE, 'Unpaid')`;
            await pool.query(fineSql, [userId, bookId, userId, fineAmount]);
        }

        const sql = `UPDATE circulation SET status = 'Returned', return_date = CURRENT_DATE WHERE book_id = $1 AND user_id = $2 AND status = 'Checked Out' RETURNING *`;
        const result = await pool.query(sql, [bookId, userId]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error returning book:', error.message);
        res.status(500).json({ error: 'Error returning book' });
    }
});

// Renew Book
app.post('/renew-book', async (req, res) => {
    const { bookId, userId } = req.body;
    const finePerDay = 20; // R20 fine per day

    try {
        // Check if the book is overdue
        const overdueCheckSql = `SELECT due_date FROM circulation WHERE book_id = $1 AND user_id = $2 AND status = 'Checked Out'`;
        const overdueCheckResult = await pool.query(overdueCheckSql, [bookId, userId]);
        if (overdueCheckResult.rowCount === 0) {
            return res.status(404).json({ error: 'No matching record found' });
        }

        const dueDate = new Date(overdueCheckResult.rows[0].due_date);
        const currentDate = new Date();
        const diffTime = currentDate - dueDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 0) {
            const fineAmount = diffDays * finePerDay;
            const fineSql = `INSERT INTO fines (user_id, transaction_id, fine_amount, fine_date, fine_status)
                             VALUES ($1, (SELECT transaction_id FROM circulation WHERE book_id = $2 AND user_id = $3 AND status = 'Checked Out'), $4, CURRENT_DATE, 'Unpaid')`;
            await pool.query(fineSql, [userId, bookId, userId, fineAmount]);
        }

        const sql = `UPDATE circulation SET due_date = due_date + INTERVAL '14 days' WHERE book_id = $1 AND user_id = $2 AND status = 'Checked Out' RETURNING *`;
        const result = await pool.query(sql, [bookId, userId]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error renewing book:', error.message);
        res.status(500).json({ error: 'Error renewing book' });
    }
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

// Update fines for overdue books
app.post('/update-fines', async (req, res) => {
    const finePerDay = 20; // R20 fine per day
    const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

    const sql = `
        WITH overdue_books AS (
            SELECT 
                c.transaction_id,
                c.user_id,
                c.book_id,
                c.due_date,
                GREATEST(0, DATE_PART('day', CURRENT_DATE - c.due_date)) AS overdue_days
            FROM circulation c
            WHERE c.status = 'Checked Out' AND c.due_date < CURRENT_DATE
        )
        INSERT INTO fines (user_id, transaction_id, fine_amount, fine_date, fine_status)
        SELECT 
            o.user_id,
            o.transaction_id,
            o.overdue_days * $1 AS fine_amount,
            CURRENT_DATE AS fine_date,
            'Unpaid' AS fine_status
        FROM overdue_books o
        ON CONFLICT (user_id, transaction_id) 
        DO UPDATE SET fine_amount = fines.fine_amount + (EXCLUDED.fine_amount - fines.fine_amount),
                      fine_date = CURRENT_DATE
        RETURNING *;
    `;

    try {
        const result = await pool.query(sql, [finePerDay]);
        // Send fine notification emails
        for (const fine of result.rows) {
            const userResult = await pool.query('SELECT email, first_name FROM Users WHERE user_id = $1', [fine.user_id]);
            const user = userResult.rows[0];
            sendFineNotificationEmail(user.email, user.first_name, fine.fine_amount);
        }
        res.json({ message: "Fines updated successfully", data: result.rows });
    } catch (error) {
        console.error('Error updating fines:', error.message);
        res.status(500).json({ error: 'Error updating fines' });
    }
});

app.get('/fines', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM fines');
        const fines = result.rows.map(fine => {
            const returnDate = new Date(fine.return_date);
            const currentDate = new Date();
            const diffTime = currentDate - returnDate;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const fineAmount = diffDays > 0 ? diffDays * fine.daily_rate : 0;
            return {
                ...fine,
                fine_amount: fineAmount
            };
        });
        res.json(fines);
    } catch (error) {
        console.error('Error fetching fines:', error.message);
        res.status(500).json({ error: 'Error fetching fines' });
    }
});

// Update a fine status
app.put('/fines/:id', (req, res) => {
    const { id } = req.params;
    const { fine_status } = req.body;
    const sql = 'UPDATE fines SET fine_status = $1 WHERE fine_id = $2 RETURNING *';
    pool.query(sql, [fine_status, id], (err, result) => {
        if (err) {
            console.error('Error updating fine status:', err.message);
            res.status(500).json({ error: 'Error updating fine status' });
            return;
        }
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Fine not found' });
        } else {
            res.json(result.rows[0]);
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
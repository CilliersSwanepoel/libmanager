import React, { useState } from 'react';
import axios from 'axios';
import './CirculationManagement.css';

function CirculationManagement() {
    const [bookId, setBookId] = useState('');
    const [userId, setUserId] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [message, setMessage] = useState('');

    // Issue Book
    const issueBook = async () => {
        try {
            const response = await axios.post('http://localhost:5000/issue-book', {
                bookId,
                userId,
                dueDate,
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Error issuing book');
            console.error(error);
        }
    };

    // Return Book
    const returnBook = async () => {
        try {
            const response = await axios.post('http://localhost:5000/return-book', { bookId, userId });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Error returning book');
            console.error(error);
        }
    };

    // Renew Book
    const renewBook = async () => {
        try {
            const response = await axios.post('http://localhost:5000/renew-book', { bookId, userId });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Error renewing book');
            console.error(error);
        }
    };

    return (
        <div className="circulation-management">
            <h1>Circulation Management</h1>
            <div>
                <h2>Issue Book</h2>
                <input
                    type="text"
                    placeholder="Book ID"
                    value={bookId}
                    onChange={(e) => setBookId(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
                <input
                    type="date"
                    placeholder="Due Date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />
                <button onClick={issueBook}>Issue Book</button>
            </div>
            <div>
                <h2>Return Book</h2>
                <input
                    type="text"
                    placeholder="Book ID"
                    value={bookId}
                    onChange={(e) => setBookId(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
                <button onClick={returnBook}>Return Book</button>
            </div>
            <div>
                <h2>Renew Book</h2>
                <input
                    type="text"
                    placeholder="Book ID"
                    value={bookId}
                    onChange={(e) => setBookId(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
                <button onClick={renewBook}>Renew Book</button>
            </div>
            {message && <p>{message}</p>}
        </div>
    );
}

export default CirculationManagement;

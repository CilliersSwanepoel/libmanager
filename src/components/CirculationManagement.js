import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CirculationManagement.css';

function CirculationManagement() {
    const [bookId, setBookId] = useState('');
    const [userId, setUserId] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [message, setMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [circulationRecords, setCirculationRecords] = useState([]);

    useEffect(() => {
        // Fetch all circulation records
        const fetchCirculationRecords = async () => {
            try {
                const response = await axios.get('http://localhost:5000/circulation');
                setCirculationRecords(response.data);
            } catch (error) {
                console.error('Error fetching circulation records', error);
            }
        };

        fetchCirculationRecords();
    }, []);

    const issueBook = async () => {
        try {
            const response = await axios.post('http://localhost:5000/issue-book', {
                bookId,
                userId,
                dueDate,
            });
            setMessage(response.data.message);

            // Fetch the updated list of circulation records
            const updatedCirculationResponse = await axios.get('http://localhost:5000/circulation');
            setCirculationRecords(updatedCirculationResponse.data);
        } catch (error) {
            setMessage('Error issuing book');
            console.error(error);
        }
    };

    const returnBook = async () => {
        try {
            const response = await axios.post('http://localhost:5000/return-book', { bookId, userId });
            setMessage(response.data.message);

            // Fetch the updated list of circulation records
            const updatedCirculationResponse = await axios.get('http://localhost:5000/circulation');
            setCirculationRecords(updatedCirculationResponse.data);
        } catch (error) {
            setMessage('Error returning book');
            console.error(error);
        }
    };

    const renewBook = async () => {
        try {
            const response = await axios.post('http://localhost:5000/renew-book', { bookId, userId });
            setMessage(response.data.message);

            // Fetch the updated list of circulation records
            const updatedCirculationResponse = await axios.get('http://localhost:5000/circulation');
            setCirculationRecords(updatedCirculationResponse.data);
        } catch (error) {
            setMessage('Error renewing book');
            console.error(error);
        }
    };

    const filteredCirculationRecords = circulationRecords
        .filter(record => record.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="circulation-management">
            <div className="form-container">
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
            <div className="table-container">
                <input
                    type="text"
                    className="search-bar"
                    placeholder="Search books..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <table>
                    <thead>
                        <tr>
                            <th>Book ID</th>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Issued Date</th>
                            <th>User ID</th>
                            <th>User Name</th>
                            <th>Due Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCirculationRecords.map(record => (
                            <tr key={record.book_id}>
                                <td>{record.book_id}</td>
                                <td>{record.title}</td>
                                <td>{record.author}</td>
                                <td>{new Date(record.issue_date).toLocaleDateString()}</td>
                                <td>{record.user_id}</td>
                                <td>{record.user_name}</td>
                                <td>{new Date(record.due_date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default CirculationManagement;
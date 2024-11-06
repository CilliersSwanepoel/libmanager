import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FineManagement.css'; // Import the CSS file

function FineManagement() {
    const [fines, setFines] = useState([]);
    const [unpaidSearch, setUnpaidSearch] = useState('');
    const [paidSearch, setPaidSearch] = useState('');

    // Fetch fines from the server
    useEffect(() => {
        const fetchFines = async () => {
            try {
                const response = await axios.get('http://localhost:5000/fines'); // Make sure this endpoint is set up on the backend
                setFines(response.data);
            } catch (error) {
                console.error('Error fetching fines:', error);
            }
        };

        fetchFines();
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleUpdateStatus = async (fineId) => {
        try {
            await axios.put(`http://localhost:5000/fines/${fineId}`, { fine_status: 'Paid' });
            setFines(fines.map(fine => fine.fine_id === fineId ? { ...fine, fine_status: 'Paid' } : fine));
        } catch (error) {
            console.error('Error updating fine status:', error);
        }
    };

    const unpaidFines = fines.filter(fine => fine.fine_status === 'Unpaid' && fine.user_id.toString().includes(unpaidSearch));
    const paidFines = fines.filter(fine => fine.fine_status === 'Paid' && fine.user_id.toString().includes(paidSearch));

    return (
        <div className="fine-management-container">
            <div className="table-container">
                <h1>Unpaid Fines</h1>
                <input
                    type="text"
                    placeholder="Search by User ID"
                    value={unpaidSearch}
                    onChange={(e) => setUnpaidSearch(e.target.value)}
                />
                <table>
                    <thead>
                        <tr>
                            <th>Fine ID</th>
                            <th>User ID</th>
                            <th>Transaction ID</th>
                            <th>Fine Amount (ZAR)</th>
                            <th>Fine Date</th>
                            <th>Fine Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {unpaidFines.map(fine => (
                            <tr key={fine.fine_id}>
                                <td>{fine.fine_id}</td>
                                <td>{fine.user_id}</td>
                                <td>{fine.transaction_id}</td>
                                <td>R{(parseFloat(fine.fine_amount) || 0).toFixed(2)}</td>
                                <td>{formatDate(fine.fine_date)}</td>
                                <td>{fine.fine_status}</td>
                                <td>
                                    <button onClick={() => handleUpdateStatus(fine.fine_id)}>Paid</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="table-container">
                <h1>Paid Fines</h1>
                <input
                    type="text"
                    placeholder="Search by User ID"
                    value={paidSearch}
                    onChange={(e) => setPaidSearch(e.target.value)}
                />
                <table>
                    <thead>
                        <tr>
                            <th>Fine ID</th>
                            <th>User ID</th>
                            <th>Transaction ID</th>
                            <th>Fine Amount (ZAR)</th>
                            <th>Fine Date</th>
                            <th>Fine Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paidFines.map(fine => (
                            <tr key={fine.fine_id}>
                                <td>{fine.fine_id}</td>
                                <td>{fine.user_id}</td>
                                <td>{fine.transaction_id}</td>
                                <td>R{(parseFloat(fine.fine_amount) || 0).toFixed(2)}</td>
                                <td>{formatDate(fine.fine_date)}</td>
                                <td>{fine.fine_status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default FineManagement;
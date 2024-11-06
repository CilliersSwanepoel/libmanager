import React, { useEffect, useState } from 'react';
import axios from 'axios';

function FineManagement() {
    const [fines, setFines] = useState([]);

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

    return (
        <div>
            <h1>Fine Management</h1>
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
                    {fines.map(fine => (
                        <tr key={fine.fine_id}>
                            <td>{fine.fine_id}</td>
                            <td>{fine.user_id}</td>
                            <td>{fine.transaction_id}</td>
                            <td>R{(parseFloat(fine.fine_amount) || 0).toFixed(2)}</td>
                            <td>{fine.fine_date}</td>
                            <td>{fine.fine_status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default FineManagement;

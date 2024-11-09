import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import BookCatalog from './components/BookCatalog';
import UserManagement from './components/UserManagement';
import CirculationManagement from './components/CirculationManagement';
import FineManagement from './components/FineManagement';

function App() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('http://localhost:5000/')
            .then(response => response.text())
            .then(data => setMessage(data))
            .catch(error => console.error('Error fetching message:', error));
    }, []);

    return (
        <Router>
            <Header />
            <div className="App">
                <header className="App-header">
                    {/* Display the message fetched from the backend */}
                    <p>{message}</p>
                </header>
                {/* Define Routes for your components */}
                <Routes>
                    <Route path="/" element={<BookCatalog />} />
                    <Route path="/users" element={<UserManagement />} />
                    <Route path="/circulation" element={<CirculationManagement />} />
                    <Route path="/fines" element={<FineManagement />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

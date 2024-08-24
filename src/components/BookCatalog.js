import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BookCatalog.css'; // Ensure your CSS file is linked for styling

function BookCatalog() {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterByGenre, setFilterByGenre] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch the list of books from the backend
        axios.get('http://localhost:5000/books')
            .then(response => {
                setBooks(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching books:', error);
                setError('Error fetching books');
                setLoading(false);
            });
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (e) => {
        setFilterByGenre(e.target.value);
    };

    // Filter and search books based on the search term and selected genre
    const filteredBooks = books.filter(book => {
        return (
            (book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
            book.author.toLowerCase().includes(searchTerm.toLowerCase()) || 
            book.isbn.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.genre.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (filterByGenre === '' || book.genre === filterByGenre)
        );
    });

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="book-catalog">
            <h1>Book Catalog</h1>

            {/* Search and Filter Options */}
            <div className="search-filter">
                <input 
                    type="text" 
                    placeholder="Search by title, author, ISBN, or genre" 
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <select value={filterByGenre} onChange={handleFilterChange}>
                    <option value="">Filter by Genre</option>
                    {/* Dynamically generate genre options */}
                    {[...new Set(books.map(book => book.genre))].map((genre, index) => (
                        <option key={index} value={genre}>{genre}</option>
                    ))}
                </select>
            </div>

            {/* Book List Display */}
            <div className="book-list">
                <h2>Books List</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>ISBN</th>
                            <th>Genre</th>
                            <th>Year</th>
                            <th>Availability</th>
                            <th>Shelf Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBooks.map((book) => (
                            <tr key={book.book_id}>
                                <td>{book.title}</td>
                                <td>{book.author}</td>
                                <td>{book.isbn}</td>
                                <td>{book.genre}</td>
                                <td>{book.publication_year}</td>
                                <td>{book.availability_status}</td>
                                <td>{book.shelf_location}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default BookCatalog;

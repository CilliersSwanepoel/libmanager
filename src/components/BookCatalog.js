import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BookCatalog.css';

function BookCatalog() {
    const [books, setBooks] = useState([]);
    const [newBook, setNewBook] = useState({
        title: '',
        author: '',
        isbn: '',
        genre: '',
        publication_year: '',
        availability_status: 'Available',
        shelf_location: '',
    });
    const [editingBook, setEditingBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = () => {
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
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editingBook) {
            setEditingBook({ ...editingBook, [name]: value });
        } else {
            setNewBook({ ...newBook, [name]: value });
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value); // Update search term state
    };

    const handleAddBook = () => {
        axios.post('http://localhost:5000/books', newBook)
            .then(() => {
                fetchBooks();
                setNewBook({
                    title: '',
                    author: '',
                    isbn: '',
                    genre: '',
                    publication_year: '',
                    availability_status: 'Available',
                    shelf_location: '',
                });
            })
            .catch(error => {
                console.error('Error adding book:', error);
                setError('Error adding book');
            });
    };

    const handleEditBook = (book) => {
        setEditingBook(book);
    };

    const handleUpdateBook = () => {
        axios.put(`http://localhost:5000/books/${editingBook.book_id}`, editingBook)
            .then(() => {
                fetchBooks();
                setEditingBook(null);
            })
            .catch(error => {
                console.error('Error updating book:', error);
                setError('Error updating book');
            });
    };

    const handleDeleteBook = (bookId) => {
        axios.delete(`http://localhost:5000/books/${bookId}`)
            .then(() => {
                fetchBooks();
            })
            .catch(error => {
                console.error('Error deleting book:', error);
                setError('Error deleting book');
            });
    };

    if (loading) {
        return <div>Loading Content...Hang in there, Bookworm</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const generateYearOptions = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let year = currentYear; year >= 1800; year--) {
            years.push(year);
        }
        return years;
    };

    
    const filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) || 
        book.isbn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.publication_year.toString().includes(searchTerm)
    );

    return (

        <div className="book-catalog">

            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search by title, author, ISBN, genre, or year"
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-bar"
            />

            {/* Form to Add or Edit a Book */}
            <div className="add-book-form">
                <h2>{editingBook ? 'Edit Book' : 'Add Book'}</h2>
                <input type="text" name="title" placeholder="Title" value={editingBook ? editingBook.title : newBook.title} onChange={handleInputChange} />
                <input type="text" name="author" placeholder="Author" value={editingBook ? editingBook.author : newBook.author} onChange={handleInputChange} />
                <input type="text" name="isbn" placeholder="ISBN" value={editingBook ? editingBook.isbn : newBook.isbn} onChange={handleInputChange} />
                <input type="text" name="genre" placeholder="Genre" value={editingBook ? editingBook.genre : newBook.genre} onChange={handleInputChange} />
                <select name="publication_year" value={editingBook ? editingBook.publication_year : newBook.publication_year} onChange={handleInputChange}>
                    <option value="">Year</option>
                    {generateYearOptions().map((year) => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
                <input type="text" name="shelf_location" placeholder="Shelf Location" value={editingBook ? editingBook.shelf_location : newBook.shelf_location} onChange={handleInputChange} />
                {editingBook ? (
                    <>
                        <button onClick={handleUpdateBook}>Update Book</button>
                        <button onClick={() => setEditingBook(null)}>Cancel</button>
                    </>
                ) : (
                    <button onClick={handleAddBook}>Add Book</button>
                )}
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
                            <th>Actions</th>
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
                                <td>
                                    <button onClick={() => handleEditBook(book)}>Edit</button>
                                    <button onClick={() => handleDeleteBook(book.book_id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default BookCatalog;
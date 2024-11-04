import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserManagement.css';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        address: '',
        account_status: 'Active',
    });
    const [editingUser, setEditingUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        axios.get('http://localhost:5000/users')
            .then(response => {
                setUsers(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
                setError('Error fetching users');
                setLoading(false);
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editingUser) {
            setEditingUser({ ...editingUser, [name]: value });
        } else {
            setNewUser({ ...newUser, [name]: value });
        }
    };

    const validateForm = (user) => {
        const errors = {};
        if (!user.first_name) errors.first_name = 'First Name is required';
        if (!user.last_name) errors.last_name = 'Last Name is required';
        if (!user.email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(user.email)) {
            errors.email = 'Email is invalid';
        }
        if (!user.phone_number) errors.phone_number = 'Phone Number is required';
        if (!user.address) errors.address = 'Address is required';
        return errors;
    };

    const handleAddUser = () => {
        const errors = validateForm(newUser);
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }
        axios.post('http://localhost:5000/users', newUser)
            .then(() => {
                fetchUsers();
                setNewUser({
                    first_name: '',
                    last_name: '',
                    email: '',
                    phone_number: '',
                    address: '',
                    account_status: 'Active',
                });
                setValidationErrors({});
            })
            .catch(error => {
                console.error('Error adding user:', error);
                setError('Error adding user');
            });
    };

    const handleUpdateUser = () => {
        const errors = validateForm(editingUser);
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }
        axios.put(`http://localhost:5000/users/${editingUser.user_id}`, editingUser)
            .then(() => {
                fetchUsers();
                setEditingUser(null);
                setValidationErrors({});
            })
            .catch(error => {
                console.error('Error updating user:', error);
                setError('Error updating user');
            });
    };

    const handleDeleteUser = (userId) => {
        axios.delete(`http://localhost:5000/users/${userId}`)
            .then(() => {
                fetchUsers();
            })
            .catch(error => {
                console.error('Error deleting user:', error);
                setError('Error deleting user');
            });
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredUsers = users.filter(user =>
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="user-management">
            {/* Search Bar */}
            <input
                type="text"
                className="search-bar"
                placeholder="Search users..."
                value={searchTerm}
                onChange={handleSearchChange}
            />

            {/* Form to Add or Edit a User */}
            <div className="add-user-form">
                <h2>{editingUser ? 'Edit User' : 'Add User'}</h2>
                <input
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    value={editingUser ? editingUser.first_name : newUser.first_name}
                    onChange={handleInputChange}
                />
                {validationErrors.first_name && <div className="error">{validationErrors.first_name}</div>}
                <input
                    type="text"
                    name="last_name"
                    placeholder="Last Name"
                    value={editingUser ? editingUser.last_name : newUser.last_name}
                    onChange={handleInputChange}
                />
                {validationErrors.last_name && <div className="error">{validationErrors.last_name}</div>}
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={editingUser ? editingUser.email : newUser.email}
                    onChange={handleInputChange}
                />
                {validationErrors.email && <div className="error">{validationErrors.email}</div>}
                <input
                    type="text"
                    name="phone_number"
                    placeholder="Phone Number"
                    value={editingUser ? editingUser.phone_number : newUser.phone_number}
                    onChange={handleInputChange}
                />
                {validationErrors.phone_number && <div className="error">{validationErrors.phone_number}</div>}
                <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={editingUser ? editingUser.address : newUser.address}
                    onChange={handleInputChange}
                />
                {validationErrors.address && <div className="error">{validationErrors.address}</div>}
                <select
                    name="account_status"
                    value={editingUser ? editingUser.account_status : newUser.account_status}
                    onChange={handleInputChange}
                >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                </select>
                {editingUser ? (
                    <>
                        <button onClick={handleUpdateUser}>Update User</button>
                        <button onClick={() => setEditingUser(null)}>Cancel</button>
                    </>
                ) : (
                    <button onClick={handleAddUser}>Add User</button>
                )}
            </div>

            {/* User List Display */}
            <div className="user-list">
                <h2>Users List</h2>
                <table>
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Phone Number</th>
                            <th>Address</th>
                            <th>Account Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.user_id}>
                                <td>{user.user_id}</td>
                                <td>{user.first_name}</td>
                                <td>{user.last_name}</td>
                                <td>{user.email}</td>
                                <td>{user.phone_number}</td>
                                <td>{user.address}</td>
                                <td>{user.account_status}</td>
                                <td>
                                    <button onClick={() => handleEditUser(user)}>Edit</button>
                                    <button onClick={() => handleDeleteUser(user.user_id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default UserManagement;
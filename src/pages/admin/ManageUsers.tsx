import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/Header';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary.js'; // adjust path as needed


const ManageUsers = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [editUser, setEditUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        password: '',
        profileImage: null,
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = user?.token;
            const res = await fetch('/api/users', {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token,
                },
            });
            const data = await res.json();
            setUsers(data.users);
            console.log('users:', data.users); // Make sure you're using the latest users data
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`/api/delete-user?user_id=${id}`, {
                method: 'DELETE',
                headers: {
                    'x-access-token': user?.token,
                },
            });

            if (!res.ok) throw new Error('Delete failed');
            setUsers((prev) => prev.filter((u) => u.id !== id)); // Make sure you're using `id` here
        } catch (err) {
            console.error('Error deleting user:', err);
        }
    };

    const handleEditClick = (user) => {
        setEditUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            role: user.role,
            password: '',
            profileImage: null,
        });
    };

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'profileImage') {
            setFormData((prev) => ({ ...prev, profileImage: files[0] }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleFormSubmit = async (e) => {

        e.preventDefault();
        if (!editUser || !editUser.id) {
            console.error("No user selected for edit or invalid user ID");
            return;
        }
        console.log("Editing user ID:", editUser.id);

        let imageUrl = editUser.profileImage;

        // Upload new image if selected
        if (formData.profileImage) {
            try {
                imageUrl = await uploadToCloudinary(formData.profileImage);
                if (!imageUrl) throw new Error("Image upload failed");
            } catch (err) {
                console.error("Cloudinary image upload error:", err);
                return;
            }
        }

        const updatedUser = {
            name: formData.name,
            email: formData.email,
            role: formData.role,
            ...(formData.password && { password: formData.password }),
            profileImage: imageUrl, // Add the logic if you're using an image upload
        };

        try {
            const res = await fetch(`/api/update-user?user_id=${editUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': user?.token,
                },
                body: JSON.stringify(updatedUser),
            });

            if (!res.ok) throw new Error('Update failed');
            const updated = await res.json();

            setUsers((prev) => prev.map((u) => (u.id === editUser.id ? updated.user : u)));
            fetchUsers(); // Refresh the user list
            setEditUser(null);
        } catch (err) {
            console.error('Error updating user:', err);
        }
    };

    return (
        <div className="p-6 min-h-screen bg-gray-900 text-white">
            <Header />
            <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.isArray(users) && users.map((u, idx) =>
                    u?.id ? (
                        <div
                            key={u.id || u.email || idx}
                            className="bg-gray-800 p-5 rounded-lg shadow-md flex flex-col items-center text-center"
                        >
                            <img
                                src={u.profileImage || 'https://placehold.co/600x400/EEE/31343C'}
                                alt="profile"
                                className="w-24 h-24 rounded-full mb-4 object-cover border border-gray-600"
                            />
                            <h2 className="text-lg font-semibold">{u.name || "Unnamed User"}</h2>
                            <p className="text-sm text-gray-400">{u.email || "No email"}</p>
                            <p className="mt-1 text-sm">
                                Role: <span className="text-green-400">{u.role || "N/A"}</span>
                            </p>
                            <div className="mt-4 flex gap-2">
                                <button
                                    className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-sm"
                                    onClick={() => handleEditClick(u)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                                    onClick={() => handleDelete(u.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ) : null
                )}


            </div>

            {editUser && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 flex justify-center items-center z-50">
                    <div className="bg-gray-800 text-white p-6 rounded-lg w-[90%] max-w-lg">
                        <h2 className="text-xl font-semibold mb-4">Edit User</h2>
                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <input
                                type="text"
                                name="name"
                                className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Name"
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Email"
                                required
                            />
                            <select
                                name="role"
                                className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded"
                                value={formData.role}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="admin">Admin</option>
                                <option value="teacher">Teacher</option>
                                <option value="student">Student</option>
                            </select>
                            <input
                                type="password"
                                name="password"
                                autoComplete="current-password" // ✅ Added to fix warning
                                className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="New Password (optional)"
                            />

                            <input
                                type="file"
                                name="profileImage"
                                onChange={handleInputChange}
                                className="text-sm"
                            />
                            <div className="flex justify-end gap-2 pt-3">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white"
                                    onClick={() => setEditUser(null)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;

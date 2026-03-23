import { useState, useEffect } from 'react';
import { getUsers } from '../services/api';
import Navbar from '../components/Navbar';

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await getUsers();
                setUsers(res.data);
            } catch (err) {
                setError('Failed to load users');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.role.toLowerCase().includes(search.toLowerCase())
    );

    const getRoleBadge = (role) => {
        if (role === 'admin') return 'bg-red-100 text-red-600';
        if (role === 'teacher') return 'bg-blue-100 text-blue-600';
        return 'bg-green-100 text-green-700';
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="max-w-5xl mx-auto px-4 py-10">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-blue-600">Manage Users</h1>
                        <p className="text-gray-500 mt-1">All registered users in the system</p>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-500">
                        <span>Total: <strong className="text-blue-600">{users.length}</strong></span>
                        <span>Students: <strong className="text-green-600">{users.filter(u => u.role === 'student').length}</strong></span>
                        <span>Teachers: <strong className="text-blue-600">{users.filter(u => u.role === 'teacher').length}</strong></span>
                    </div>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search by username, email or role..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-100 text-red-600 px-4 py-2 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                {/* Content */}
                {loading ? (
                    <div className="text-center text-gray-400 mt-20 text-lg">
                        Loading users...
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="text-center text-gray-400 mt-20 text-lg">
                        No users found.
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-blue-600 text-white">
                                <tr>
                                    <th className="text-left px-6 py-3 font-semibold">#</th>
                                    <th className="text-left px-6 py-3 font-semibold">Username</th>
                                    <th className="text-left px-6 py-3 font-semibold">Email</th>
                                    <th className="text-left px-6 py-3 font-semibold">Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user, index) => (
                                    <tr
                                        key={user.id}
                                        className="border-b border-gray-100 hover:bg-gray-50 transition"
                                    >
                                        <td className="px-6 py-4 text-gray-400">{index + 1}</td>
                                        <td className="px-6 py-4 font-medium text-gray-800">
                                            {user.username}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {user.email || '—'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getRoleBadge(user.role)}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Users;
import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import AdminHeader from './AdminHeader';
import AdminFooter from './AdminFooter';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", role: "" });
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setEditForm({ name: user.name, role: user.role });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/api/admin/users/${editUser.id}`,
        { name: editForm.name, role: editForm.role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update user");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete user");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen w-screen flex flex-col bg-[var(--primary-black)] text-white">
      <AdminHeader />
      
      {/* Main Content */}
      <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">User Management</h1>
          
          <div className="mb-6 max-w-md mx-auto">
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
      {loading ? (
        <div className="flex justify-center items-center" style={{height: '200px'}}>
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[var(--accent-teal)]"></div>
        </div>
      ) : error ? (
        <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-lg text-center">{error}</div>
      ) : (
        <div className="overflow-x-auto bg-gray-900 rounded-xl shadow-lg border border-gray-800">
          <table className="w-full">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'admin' ? 'bg-[var(--accent-teal)]/20 text-[var(--accent-teal)]' : 'bg-gray-600/20 text-gray-300'}`}>{user.role}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      className="p-1 mr-2 rounded-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 transition-colors"
                      title="Edit"
                      onClick={() => handleEdit(user)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="p-1 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-colors"
                      title="Delete"
                      onClick={() => handleDelete(user.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

        </div>
      </main>
      
      {/* Edit User Modal */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 w-full max-w-md p-6">
            <form onSubmit={handleEditSubmit}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Edit User</h3>
                <button 
                  type="button" 
                  className="text-gray-400 hover:text-white"
                  onClick={() => setEditUser(null)}
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-2">Name</label>
                <input
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">Role</label>
                <select
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent"
                  name="role"
                  value={editForm.role}
                  onChange={handleEditChange}
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button 
                  type="button" 
                  className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                  onClick={() => setEditUser(null)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[var(--primary-violet)] to-[var(--accent-teal)] text-white hover:opacity-90 transition-opacity"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <AdminFooter />
    </div>
  );
};

export default AdminUsers;

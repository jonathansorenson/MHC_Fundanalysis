import { useState, useEffect, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3333';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', role: 'read' });
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/users`);
      if (res.ok) setUsers(await res.json());
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const addUser = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/admin/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed');
      setForm({ email: '', password: '', role: 'read' });
      setShowAdd(false);
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateRole = async (id, role) => {
    await fetch(`${API_BASE}/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    fetchUsers();
  };

  const deleteUser = async (id) => {
    if (!confirm('Are you sure you want to remove this user?')) return;
    await fetch(`${API_BASE}/api/admin/users/${id}`, { method: 'DELETE' });
    fetchUsers();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">User Management</h2>
          <p className="text-mhc-muted text-sm">Manage dashboard access and roles</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="bg-mhc-accent text-mhc-navy px-4 py-2 rounded-lg text-sm font-semibold hover:bg-mhc-accent/90 transition"
        >
          {showAdd ? 'Cancel' : '+ Add User'}
        </button>
      </div>

      {/* Add user form */}
      {showAdd && (
        <div className="bg-mhc-card border border-mhc-border rounded-xl p-5">
          <h3 className="text-white text-sm font-semibold mb-3">New User</h3>
          {error && <div className="text-red-400 text-sm mb-3">{error}</div>}
          <form onSubmit={addUser} className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-mhc-muted text-xs block mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full bg-mhc-navy border border-mhc-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-mhc-accent"
                required
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="text-mhc-muted text-xs block mb-1">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full bg-mhc-navy border border-mhc-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-mhc-accent"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="text-mhc-muted text-xs block mb-1">Role</label>
              <select
                value={form.role}
                onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                className="bg-mhc-navy border border-mhc-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-mhc-accent"
              >
                <option value="read">Read</option>
                <option value="owner">Owner</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit" className="bg-mhc-accent text-mhc-navy px-4 py-2 rounded-lg text-sm font-semibold">
              Create
            </button>
          </form>
        </div>
      )}

      {/* Users table */}
      <div className="bg-mhc-card border border-mhc-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-mhc-border text-mhc-muted text-xs">
                <th className="text-left px-5 py-3 font-medium">Email</th>
                <th className="text-left px-5 py-3 font-medium">Role</th>
                <th className="text-left px-5 py-3 font-medium">Created</th>
                <th className="text-right px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {loading ? (
                <tr><td colSpan={4} className="px-5 py-8 text-center text-mhc-muted">Loading…</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={4} className="px-5 py-8 text-center text-mhc-muted">No users found. API may be offline.</td></tr>
              ) : users.map(u => (
                <tr key={u.id} className="border-b border-mhc-border/50 hover:bg-mhc-navy/40">
                  <td className="px-5 py-3">{u.email}</td>
                  <td className="px-5 py-3">
                    <select
                      value={u.role || 'read'}
                      onChange={e => updateRole(u.id, e.target.value)}
                      className="bg-mhc-navy border border-mhc-border rounded px-2 py-1 text-xs text-white"
                    >
                      <option value="read">Read</option>
                      <option value="owner">Owner</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-5 py-3 text-mhc-muted">{u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => deleteUser(u.id)} className="text-red-400 hover:text-red-300 text-xs">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

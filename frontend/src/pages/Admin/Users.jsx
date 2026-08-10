import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaTrashAlt, FaChevronRight, FaSearch } from "react-icons/fa";
import { getUsers, deleteUser, updateUser } from "../../services/adminService";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const { data } = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleRoleChange = async (id, newRole) => {
    try {
      await updateUser(id, { role: newRole });
      loadUsers();
    } catch (err) {
      console.error("Failed to update user role:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    await deleteUser(id);
    loadUsers();
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Volt Header */}
      <div className="volt-page-header">
        <div>
          <div className="volt-breadcrumb">
            <Link to="/admin">Admin</Link>
            <FaChevronRight className="text-[10px]" />
            <span>Users</span>
          </div>
          <div className="volt-page-title">
            <h1>User Management</h1>
            <p className="volt-page-subtitle">
              Manage registered accounts, assigned system roles, and platform permissions.
            </p>
          </div>
        </div>

        <div className="volt-action-btns">
          <div className="volt-search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Search user by name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Volt Panel Table */}
      <div className="volt-panel">
        <div className="volt-panel-header">
          <div className="volt-panel-title">
            <FaUsers />
            <span>Platform Users ({filteredUsers.length})</span>
          </div>
        </div>

        <div className="volt-table-container">
          {loading ? (
            <div className="volt-empty">Loading user accounts...</div>
          ) : (
            <table className="volt-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>Joined Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const initial = u.username
                    ? u.username.charAt(0).toUpperCase()
                    : u.email
                    ? u.email.charAt(0).toUpperCase()
                    : "U";
                  return (
                    <tr key={u.id}>
                      <td>
                        <div className="volt-user-cell">
                          <div className="volt-avatar">{initial}</div>
                          <div>
                            <div className="volt-user-cell-name">{u.username}</div>
                            <div className="volt-user-cell-sub">ID: #{u.id}</div>
                          </div>
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>
                        <select
                          className="volt-select py-1 px-2 text-xs w-auto bg-[#161618] border border-white/10 rounded text-white cursor-pointer"
                          value={u.role || "participant"}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        >
                          <option value="participant">Participant</option>
                          <option value="organizer">Organizer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>{u.phone || "—"}</td>
                      <td>{new Date(u.date_joined).toLocaleDateString()}</td>
                      <td>
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="volt-btn volt-btn--danger volt-btn--sm"
                        >
                          <FaTrashAlt /> Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          {!loading && filteredUsers.length === 0 && (
            <div className="volt-empty">No matching users found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";

import { getUsers, deleteUser } from "../../services/adminService";

export default function AdminUsers() {

  const [users, setUsers] = useState([]);



  useEffect(() => { loadUsers(); }, []);



  async function loadUsers() {

    const { data } = await getUsers();

    setUsers(data);

  }



  const handleDelete = async (id) => {

    if (!confirm("Delete this user?")) return;

    await deleteUser(id);

    loadUsers();

  };



  return (

    <div className="organizer-page">

      <header className="organizer-page__header">

        <div>

          <p className="section-label">Admin</p>

          <h1 className="organizer-page__title">User management</h1>

          <p className="organizer-page__subtitle">View accounts, roles, and remove users when needed.</p>

        </div>

      </header>



      <div className="organizer-table-panel">

        <table className="organizer-data-table">

          <thead>

            <tr>

              <th>Username</th>

              <th>Email</th>

              <th>Role</th>

              <th>Phone</th>

              <th>Joined</th>

              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            {users.map((u) => (

              <tr key={u.id}>

                <td className="text-white font-medium">{u.username}</td>

                <td>{u.email}</td>

                <td>

                  <span className="organizer-badge organizer-badge--brand capitalize">{u.role}</span>

                </td>

                <td>{u.phone || "—"}</td>

                <td className="text-gray-500">{new Date(u.date_joined).toLocaleDateString()}</td>

                <td>

                  <button onClick={() => handleDelete(u.id)} className="text-red-400 hover:text-red-300 text-xs font-semibold uppercase tracking-wide">

                    Delete

                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

        {users.length === 0 && <p className="organizer-empty">No users found.</p>}

      </div>

    </div>

  );

}



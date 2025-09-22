import { useEffect, useState } from "react";
import API from "../api";
import UserTable from "../components/UserTable";
import UserFormModal from "../components/UserFormModal";

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("add"); // "add" or "edit"

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/users");
        setUsers(res.data);
      } catch (err) {
        setError("Error fetching users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAddClick = () => {
    setFormMode("add");
    setCurrentUser(null);
    setModalOpen(true);
  };

  const handleEditClick = (user) => {
    setFormMode("edit");
    setCurrentUser(user);
    setModalOpen(true);
  };

  const handleDeleteClick = async (id) => {
    await API.delete(`/users/${id}`);
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  const handleFormSubmit = async (formData) => {
    if (formMode === "add") {
      const res = await API.post("/users", formData);
      setUsers([...users, res.data]);
    } else {
      const res = await API.put(`/users/${currentUser.id}`, formData);
      setUsers(users.map((user) => (user.id === currentUser.id ? res.data : user)));
    }
    setModalOpen(false);
  };

  // ✅ Return JSX at the top level
  if (loading) return <p>Loading Users...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>User Management Dashboard</h1>
        <button className="btn btn-success" onClick={handleAddClick}>
          Add User
        </button>
      </div>

      <UserTable
        users={users}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {modalOpen && (
        <UserFormModal
          mode={formMode}
          initialData={currentUser}
          onSubmit={handleFormSubmit}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}

export default Dashboard;

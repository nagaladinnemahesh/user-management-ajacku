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
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/users");
        const usersWithNames = res.data.map((user) => {
            const [firstName, ...lastName] = user.name.split(" ");
            return {
                ...user,
                firstName,
                lastName: lastName.join(" "),
                department: user.department || "N/A", // Default if no department  
            };
        });

        setUsers(usersWithNames);
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
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;
    try{
        await API.delete(`/users/${id}`);
        setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch(err){
        alert("Failed to delete user. Please try again.")
    }
  };

  const handleFormSubmit = async(formData) => {
    setSaving(true);
    try {
        if (formMode === "add"){
            const maxId = users.length > 0 ? Math.max(...users.map((u) => u.id)): 0;
            const newUser = {
                id: maxId + 1,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                department: formData.department || "N/A",
            };

            await API.post("/users", newUser);
            setUsers((prev) => [...prev, newUser]);
        } else {
            const updatedUser = {
                ...currentUser,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                department: formData.department || "N/A",
            };

            await API.put(`/users/${currentUser.id}`, updatedUser);
            setUsers((prev) => prev.map((user) => user.id === currentUser.id ? updatedUser : user));
        }
        
        setModalOpen(false);
            } catch(err){
                alert("Failed to save user");
            } finally {
                setSaving(false);
            }
        }

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
          saving = {saving}
        />
      )}
    </div>
  );
}

export default Dashboard;

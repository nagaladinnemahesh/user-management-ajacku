import { useEffect, useState } from "react";
import API from "../api";
import UserTable from "../components/UserTable";
import UserFormModal from "../components/UserFormModal";
import { Modal, Button, Form } from "react-bootstrap";

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [saving, setSaving] = useState(false);

  // Pagination & Filter/Search/Sort
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filterData, setFilterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  });

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/users");
        const usersWithNames = res.data.map((user) => {
          const [firstName, ...lastNameParts] = user.name.split(" ");
          return {
            ...user,
            firstName,
            lastName: lastNameParts.join(" "),
            department: user.department || "N/A",
          };
        });
        setUsers(usersWithNames);
      } catch {
        setError("Error fetching users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filtering, Search, and Sorting
  useEffect(() => {
    let tempUsers = [...users];

    Object.keys(filterData).forEach((key) => {
      if (filterData[key]) {
        tempUsers = tempUsers.filter((user) =>
          user[key].toLowerCase().includes(filterData[key].toLowerCase())
        );
      }
    });

    if (searchQuery) {
      tempUsers = tempUsers.filter((user) =>
        Object.values(user).some((val) =>
          String(val).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    if (sortConfig.key) {
      tempUsers.sort((a, b) => {
        let aVal = a[sortConfig.key]
        let bVal = b[sortConfig.key]
        if (typeof aVal === "string") aVal = aVal.toLowerCase();
        if (typeof bVal === "string") bVal = bVal.toLowerCase();
        
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredUsers(tempUsers);
    setCurrentPage(1);
  }, [users, filterData, searchQuery, sortConfig]);

  // Pagination logic
  const indexOfLast = currentPage * pageSize;
  const indexOfFirst = indexOfLast - pageSize;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  // Handlers
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
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await API.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch {
      alert("Failed to delete user. Please try again.");
    }
  };

  const handleFormSubmit = async (formData) => {
    setSaving(true);
    try {
      if (formMode === "add") {
        const maxId = users.length > 0 ? Math.max(...users.map((u) => u.id)) : 0;
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
        setUsers((prev) =>
          prev.map((user) => (user.id === currentUser.id ? updatedUser : user))
        );
      }
      setModalOpen(false);
    } catch {
      alert("Failed to save user");
    } finally {
      setSaving(false);
    }
  };

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      } else {
        return { key, direction: "asc" };
      }
    });
  };

  if (loading) return <p>Loading Users...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>User Management Dashboard</h1>
        <button className="btn btn-success" onClick={handleAddClick}>
          Add User
        </button>
      </div>

      {/* Search & Filter */}
      <div className="d-flex mb-2 gap-2">
        <input
          type="text"
          placeholder="Search..."
          className="form-control"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="btn btn-secondary" onClick={() => setFilterModalOpen(true)}>
          Filter
        </button>
      </div>

      {/* Table */}
      <UserTable
        users={currentUsers}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onSort={handleSort}
        sortConfig={sortConfig}
      />

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-2">
        <div>
          Page {currentPage} of {totalPages}
        </div>
        <div className="d-flex gap-2">
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="form-select"
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size} per page
              </option>
            ))}
          </select>
          <button
            className="btn btn-outline-primary"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </button>
          <button
            className="btn btn-outline-primary"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <UserFormModal
          mode={formMode}
          initialData={currentUser}
          onSubmit={handleFormSubmit}
          onClose={() => setModalOpen(false)}
          saving={saving}
        />
      )}

      {/* Filter Modal */}
      <Modal show={filterModalOpen} onHide={() => setFilterModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Filter Users</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {["firstName", "lastName", "email", "department"].map((field) => (
            <Form.Group className="mb-2" key={field}>
              <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
              <Form.Control
                type="text"
                value={filterData[field]}
                onChange={(e) =>
                  setFilterData((prev) => ({ ...prev, [field]: e.target.value }))
                }
              />
            </Form.Group>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() =>
              setFilterData({ firstName: "", lastName: "", email: "", department: "" })
            }
          >
            Reset
          </Button>
          <Button variant="primary" onClick={() => setFilterModalOpen(false)}>
            Apply
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Dashboard;

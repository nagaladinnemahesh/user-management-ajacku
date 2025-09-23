import { useEffect, useState } from "react";
import API from "../api";
import UserTable from "../components/UserTable";
import UserFormModal from "../components/UserFormModal";
import { Button, Form } from "react-bootstrap";
import FilterModal from "../components/FilterModal";

function Dashboard() {
  // state variables 
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [saving, setSaving] = useState(false);

  //  for pagination & sorting
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // search and filter modal
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    firstName: true,
    lastName: true,
    email: true,
    department: true,
  });

  // fetching users from mock api 
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await API.get("/users");

        // splitting name into first and last names

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

  // apply search, filter and sorting
  useEffect(() => {
    let tempUsers = [...users];

    // filter based on search
    if (searchQuery) {
      tempUsers = tempUsers.filter((user) =>
        Object.values(user).some((val) =>
          String(val).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // for Sorting
    if (sortConfig.key) {
      tempUsers.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        if (typeof aVal === "string") aVal = aVal.toLowerCase();
        if (typeof bVal === "string") bVal = bVal.toLowerCase();

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredUsers(tempUsers);
    setCurrentPage(1); // reset to first page
  }, [users, searchQuery, sortConfig]);

  // for pagination

  const indexOfLast = currentPage * pageSize;
  const indexOfFirst = indexOfLast - pageSize;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  // Handle edit, delete, add
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

  // add and edit user form submissions
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

  // show loading, error status

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-4 centered">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>User Management Dashboard - Ajackus</h1>
      </div>

      {/* search and filter users */}
      <div className="d-flex flex-wrap gap-2 mb-2 align-items-center">
        <Form.Control
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ minWidth: "200px" }} 
        />
        <Button variant="secondary" size="sm" onClick={() => setFilterModalOpen(true)}>
            Filter Columns
        </Button>
        <Button variant="success" size="sm" onClick={handleAddClick}>
            Add User
        </Button>
</div>


      {/* Table */}
      <div className="table-responsive">
        <UserTable
          users={currentUsers}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onSort={handleSort}
          sortConfig={sortConfig}
          visibleColumns={visibleColumns}
        />
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-2">
        <div>Page {currentPage} of {totalPages}</div>
        <div className="d-flex gap-2">
          <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} className="form-select">
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>{size} per page</option>
            ))}
          </select>
          <Button variant="outline-primary" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Prev</Button>
          <Button variant="outline-primary" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(prev => prev + 1)}>Next</Button>
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

      {/* Filter Columns Modal */}
      <FilterModal
        show={filterModalOpen}
        handleClose={() => setFilterModalOpen(false)}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
      />
    </div>
  );
}

export default Dashboard;

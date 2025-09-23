import { useEffect, useState } from "react";
import API from "../api";
import UserTable from "../components/UserTable";
import UserFormModal from "../components/UserFormModal";

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

    // Apply filter
    Object.keys(filterData).forEach((key) => {
      if (filterData[key]) {
        tempUsers = tempUsers.filter((user) =>
          user[key].toLowerCase().includes(filterData[key].toLowerCase())
        );
      }
    });

    // Apply search
    if (searchQuery) {
      tempUsers = tempUsers.filter((user) =>
        Object.values(user).some((val) =>
          String(val).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      tempUsers.sort((a, b) => {
        const aVal = a[sortConfig.key].toLowerCase();
        const bVal = b[sortConfig.key].toLowerCase();
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredUsers(tempUsers);
    setCurrentPage(1); // Reset page on filter/search change
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
    <div>
      <h1>User Management Dashboard</h1>
      <button onClick={handleAddClick}>Add User</button>

      {/* Search & Filter */}
      <div>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={() => setFilterModalOpen(true)}>Filter</button>
      </div>

      {/* Table */}
      <UserTable
        users={currentUsers}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onSort={handleSort}
        sortConfig={sortConfig}
      />

      {/* Pagination Controls */}
      <div>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <div>
          <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size} per page
              </option>
            ))}
          </select>
          <button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>
            Prev
          </button>
          <button
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
      {filterModalOpen && (
        <div>
          <h3>Filter Users</h3>
          {["firstName", "lastName", "email", "department"].map((field) => (
            <div key={field}>
              <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                type="text"
                value={filterData[field]}
                onChange={(e) =>
                  setFilterData((prev) => ({ ...prev, [field]: e.target.value }))
                }
              />
            </div>
          ))}
          <button
            onClick={() =>
              setFilterData({ firstName: "", lastName: "", email: "", department: "" })
            }
          >
            Reset
          </button>
          <button onClick={() => setFilterModalOpen(false)}>Apply</button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

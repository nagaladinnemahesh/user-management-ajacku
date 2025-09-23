function UserTable({ users, onEdit, onDelete, onSort, sortConfig }) {
  const renderSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? " ▲" : " ▼";
    }
    return "";
  };

  return (
    <table className="table table-bordered table-hover">
      <thead className="table-light">
        <tr>
          <th onClick={() => onSort("id")} style={{ cursor: "pointer" }}>
            ID{renderSortIndicator("id")}
          </th>
          <th onClick={() => onSort("firstName")} style={{ cursor: "pointer" }}>
            First Name{renderSortIndicator("firstName")}
          </th>
          <th onClick={() => onSort("lastName")} style={{ cursor: "pointer" }}>
            Last Name{renderSortIndicator("lastName")}
          </th>
          <th onClick={() => onSort("email")} style={{ cursor: "pointer" }}>
            Email{renderSortIndicator("email")}
          </th>
          <th onClick={() => onSort("department")} style={{ cursor: "pointer" }}>
            Department{renderSortIndicator("department")}
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.length === 0 ? (
          <tr>
            <td colSpan="6" className="text-center">
              No users found.
            </td>
          </tr>
        ) : (
          users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.department}</td>
              <td>
                <button className="btn btn-sm btn-primary me-2" onClick={() => onEdit(user)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => onDelete(user.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default UserTable;

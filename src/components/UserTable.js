function UserTable({ users, onEdit, onDelete, onSort, sortConfig }) {
  const renderSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? " ▲" : " ▼";
    }
    return "";
  };

  return (
    <table border="1" cellPadding="5" cellSpacing="0">
      <thead>
        <tr>
          <th onClick={() => onSort("id")}>ID{renderSortIndicator("id")}</th>
          <th onClick={() => onSort("firstName")}>
            First Name{renderSortIndicator("firstName")}
          </th>
          <th onClick={() => onSort("lastName")}>
            Last Name{renderSortIndicator("lastName")}
          </th>
          <th onClick={() => onSort("email")}>Email{renderSortIndicator("email")}</th>
          <th onClick={() => onSort("department")}>
            Department{renderSortIndicator("department")}
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.length === 0 ? (
          <tr>
            <td colSpan="6" style={{ textAlign: "center" }}>
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
                <button onClick={() => onEdit(user)}>Edit</button>{" "}
                <button onClick={() => onDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default UserTable;

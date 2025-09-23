import { Table, Button } from "react-bootstrap";

function UserTable({ users, onEdit, onDelete, onSort, sortConfig, visibleColumns }) {
  const renderSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? " ▲" : " ▼";
    }
    return "";
  };

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          {visibleColumns.id && (
            <th onClick={() => onSort("id")} style={{ cursor: "pointer" }}>
              ID {renderSortIndicator("id")}
            </th>
          )}
          {visibleColumns.firstName && (
            <th onClick={() => onSort("firstName")} style={{ cursor: "pointer" }}>
              First Name {renderSortIndicator("firstName")}
            </th>
          )}
          {visibleColumns.lastName && (
            <th onClick={() => onSort("lastName")} style={{ cursor: "pointer" }}>
              Last Name {renderSortIndicator("lastName")}
            </th>
          )}
          {visibleColumns.email && (
            <th onClick={() => onSort("email")} style={{ cursor: "pointer" }}>
              Email {renderSortIndicator("email")}
            </th>
          )}
          {visibleColumns.department && (
            <th onClick={() => onSort("department")} style={{ cursor: "pointer" }}>
              Department {renderSortIndicator("department")}
            </th>
          )}
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {users.length === 0 ? (
          <tr>
            <td colSpan={Object.values(visibleColumns).filter(Boolean).length + 1} className="text-center">
              No users found.
            </td>
          </tr>
        ) : (
          users.map((user) => (
            <tr key={user.id}>
              {visibleColumns.id && <td>{user.id}</td>}
              {visibleColumns.firstName && <td>{user.firstName}</td>}
              {visibleColumns.lastName && <td>{user.lastName}</td>}
              {visibleColumns.email && <td>{user.email}</td>}
              {visibleColumns.department && <td>{user.department}</td>}
              <td>
                <Button size="sm" variant="primary" className="me-2" onClick={() => onEdit(user)}>
                  Edit
                </Button>
                <Button size="sm" variant="danger" onClick={() => onDelete(user.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
}

export default UserTable;

function UserTable({users, onEdit, onDelete}){
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Department</th>
                    </tr>
                </thead>
                <tbody>
                    
                        {users.map((user) => (
                            <tr key = {user.id}>
                                <td>{user.id}</td>
                                <td>{user.name.split(" ")[0]}</td>
                                <td>{user.name.split(" ")[1] || ""}</td>
                                <td>{user.email}</td>
                                <td>{user.department?.department}</td>
                                <td>
                                    <button onClick={() => onEdit(user)}>Edit</button>
                                    <button onClick={() => onDelete(user.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    )
}

export default UserTable;
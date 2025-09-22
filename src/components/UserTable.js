function UserTable({users}){
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
                    {users.length > 0 ? (
                        users.map((user) => (
                            <tr key = {user.id}>
                                <td>{user.id}</td>
                                <td>{user.name.split(" ")[0]}</td>
                                <td>{user.name.split(" ")[1] || ""}</td>
                                <td>{user.email}</td>
                                <td>{user.department?.department}</td>
                                <td>
                                    <button>Add</button>
                                    <button>Edit</button>
                                    <button>Delete</button>
                                </td>
                            </tr>
                        ))
                    ): (
                        <tr>
                            <td>No users found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default UserTable;
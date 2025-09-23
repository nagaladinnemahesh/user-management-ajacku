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

                        {
                            users.length === 0 ? (
                                <tr>
                                    <td className="text-center">
                                        No users found
                                    </td>
                                </tr>
                            )
                            :
                    
                        (users.map((user) => (
                            <tr key = {user.id}>
                                <td>{user.id}</td>
                                <td>{user.firstName}</td>
                                <td>{user.lastName}</td>
                                <td>{user.email}</td>
                                <td>{user.department}</td>
                                <td>
                                    <button onClick={() => onEdit(user)}>Edit</button>
                                    <button onClick={() => onDelete(user.id)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default UserTable;
import {useEffect, useState} from "react";
import API from "../api";
import UserTable from "../components/UserTable";

function Dashboard(){
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
        try{
            const response = await API.get("/users");
            setUsers(response.data);
        } catch (err){
            setError("Error fetching users");
        }
    };

    fetchUsers();

}, []);

if (error) return <p>{error}</p>

    return (
        <div>
            <h1>User Management Dashboard</h1>
            <p>Manage Users - view, add, edit and delete</p>
            <UserTable users={users} />
        </div>
    )
}

export default Dashboard;
import { UserList } from "../cmps/UserList.jsx"
import { userService } from "../services/user.service.js"
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'


const { useState, useEffect } = React


export function Admin() {
    const [users, setUsers] = useState(null)

    useEffect(() => {
        loadUsers()
    }, [])

    function loadUsers() {
        userService.query().then(setUsers)
    }

    function onRemoveUser(userId) {
        userService
            .remove(userId)
            .then(() => {
                console.log('Deleted Succesfully!')
                const usersToUpdate = users.filter((user) => user._id !== userId)
                setUsers(usersToUpdate)
                showSuccessMsg('user removed')
            })
            .catch((err) => {
                console.log('Error from onRemoveUser ->', err)
                showErrorMsg('Cannot remove user')
            })
    }

    return (
        <main>
            <h3>Admin App</h3>
            <main>
                <UserList users={users} onRemoveUser={onRemoveUser} />
            </main>
        </main>
    )
}
import { UserPreview } from "./UserPreview.jsx"

const { Link } = ReactRouterDOM


export function UserList({ users, onRemoveUser }) {

    if (!users) return <div>Loading...</div>
    return (
        <ul className="bug-list">
            {users.map((user) => (
                <li className="bug-preview" key={user._id}>
                    <UserPreview user={user} />
                    <div>
                        <button onClick={() => onRemoveUser(user._id)}>x</button>
                    </div>
                </li>
            ))
            }
        </ul >
    )
}
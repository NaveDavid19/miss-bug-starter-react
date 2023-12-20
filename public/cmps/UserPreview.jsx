export function UserPreview({ user }) {
    console.log(user);
    return <article>
        <h4>{user._id}</h4>
        <h1><img src="https://t3.ftcdn.net/jpg/03/53/11/00/360_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg" alt="" /></h1>
        <p>Full-name: <span>{user.fullname}</span></p>
    </article>
}
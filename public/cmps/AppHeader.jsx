import { UserMsg } from './UserMsg.jsx'
import { LoginSignup } from './LoginSignup.jsx'
import { userService } from '../services/user.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'

const { Link, NavLink } = ReactRouterDOM
const { useState } = React
const { useNavigate } = ReactRouter

export function AppHeader() {

  const navigate = useNavigate()

  const [user, setUser] = useState(userService.getLoggedinUser())

  function onLogout() {
    userService.logout()
      .then(() => {
        onSetUser(null)
      })
      .catch((err) => {
        showErrorMsg('OOPs try again')
      })
  }

  function onSetUser(user) {
    setUser(user)
    navigate('/')
  }

  return (
    <header className="app-header full main-layout">
      <section className="header-container">
        <nav className="app-nav">
          <NavLink to="/" >Home</NavLink>
          <NavLink to="/bug" >Bugs</NavLink>
          <NavLink to="/about" >About</NavLink>
          {user && user.isAdmin ? <NavLink to="/admin">Admin</NavLink> : null}
        </nav>
      </section>
      {user ? (
        < section >

          <Link to={`/user/${user._id}`}>Hello {user.fullname}</Link>
          <button onClick={onLogout}>Logout</button>
        </ section >
      ) : (
        <section>
          <LoginSignup onSetUser={onSetUser} />
        </section>
      )}
      <UserMsg />
    </header>
  )
}

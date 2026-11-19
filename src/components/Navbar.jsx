import { NavLink, useNavigate } from "react-router";
import { readToken } from "../auth.js";

function Navbar({ token, onLogout }) {
    const navigate = useNavigate();
    const user = token ? readToken(token) : null;

    function handleClick() {
        onLogout();
        navigate("/login");
    }

    return (
        <nav className="navbar">
            <span className="logo">🎬 CineHub</span>
            <NavLink to="/">Films</NavLink>

            {user ? (
                <>
                    <NavLink to="/reservations">Mes réservations</NavLink>
                    {user.us_role === "admin" && <NavLink to="/admin">Admin</NavLink>}
                    <span className="hello">Bonjour {user.us_username}</span>
                    <button className="logout" onClick={handleClick}>Déconnexion</button>
                </>
            ) : (
                <NavLink to="/login">Connexion</NavLink>
            )}
        </nav>
    );
}

export default Navbar;

import { NavLink } from "react-router";

function Navbar() {
    return (
        <nav className="navbar">
            <span className="logo">🎬 CineHub</span>
            <NavLink to="/">Films</NavLink>
            <NavLink to="/reservations">Mes réservations</NavLink>
            <NavLink to="/login">Connexion</NavLink>
        </nav>
    );
}

export default Navbar;

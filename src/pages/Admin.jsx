import AdminFilms from "../components/AdminFilms.jsx";
import AdminRooms from "../components/AdminRooms.jsx";
import AdminScreenings from "../components/AdminScreenings.jsx";

function Admin() {
    return (
        <div>
            <h1>Espace administrateur</h1>
            <AdminFilms />
            <AdminRooms />
            <AdminScreenings />
        </div>
    );
}

export default Admin;

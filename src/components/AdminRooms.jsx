import { useState, useEffect } from "react";
import { apiFetch } from "../api.js";

const EMPTY_ROOM = { name: "", capacity: "" };

function AdminRooms() {
    const [rooms, setRooms] = useState([]);
    const [form, setForm] = useState(EMPTY_ROOM);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        async function loadRooms() {
            const { ok, data } = await apiFetch("/rooms");
            if (ok) setRooms(data);
            else setError(data.error);
        }
        loadRooms();
    }, [refresh]);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleCreate(e) {
        e.preventDefault();
        setMessage("");
        setError("");

        const { ok, data } = await apiFetch("/rooms", {
            method: "POST",
            body: JSON.stringify({ name: form.name, capacity: Number(form.capacity) })
        });

        if (!ok) {
            setError(data.error);
            return;
        }
        setMessage("Salle créée !");
        setForm(EMPTY_ROOM);
        setRefresh(refresh + 1);
    }

    return (
        <section className="admin-section">
            <h2>Salles</h2>

            <form className="admin-form" onSubmit={handleCreate}>
                <input name="name" placeholder="Nom de la salle *" value={form.name} onChange={handleChange} required />
                <input name="capacity" type="number" placeholder="Capacité *" value={form.capacity} onChange={handleChange} required />
                <button type="submit">Ajouter la salle</button>
            </form>

            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}

            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Capacité</th>
                    </tr>
                </thead>
                <tbody>
                    {rooms.map((room) => (
                        <tr key={room.ro_id}>
                            <td>{room.ro_name}</td>
                            <td>{room.ro_capacity} places</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}

export default AdminRooms;

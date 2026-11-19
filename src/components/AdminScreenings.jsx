import { useState, useEffect } from "react";
import { apiFetch } from "../api.js";
import { formatDate } from "../format.js";

const EMPTY_SCREENING = { film: "", room: "", datetime: "", price: "" };

function AdminScreenings() {
    const [screenings, setScreenings] = useState([]);
    const [films, setFilms] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [form, setForm] = useState(EMPTY_SCREENING);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [refresh, setRefresh] = useState(0);

    // Charge les séances, et les films + salles pour les listes déroulantes
    useEffect(() => {
        async function loadAll() {
            const [s, f, r] = await Promise.all([
                apiFetch("/screenings"),
                apiFetch("/films"),
                apiFetch("/rooms")
            ]);
            if (s.ok) setScreenings(s.data);
            if (f.ok) setFilms(f.data);
            if (r.ok) setRooms(r.data);
        }
        loadAll();
    }, [refresh]);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleCreate(e) {
        e.preventDefault();
        setMessage("");
        setError("");

        const { ok, data } = await apiFetch("/screenings", {
            method: "POST",
            body: JSON.stringify({
                film: Number(form.film),
                room: Number(form.room),
                datetime: form.datetime.replace("T", " ") + ":00", // "2026-12-10T20:30" → "2026-12-10 20:30:00"
                price: Number(form.price)
            })
        });

        if (!ok) {
            setError(data.error);
            return;
        }
        setMessage("Séance créée !");
        setForm(EMPTY_SCREENING);
        setRefresh(refresh + 1);
    }

    async function handleDelete(id) {
        if (!window.confirm("Supprimer cette séance et ses réservations ?")) return;
        setMessage("");
        setError("");

        const { ok, data } = await apiFetch(`/screenings/${id}`, { method: "DELETE" });
        if (!ok) {
            setError(data.error);
            return;
        }
        setRefresh(refresh + 1);
    }

    return (
        <section className="admin-section">
            <h2>Séances</h2>

            <form className="admin-form" onSubmit={handleCreate}>
                <select name="film" value={form.film} onChange={handleChange} required>
                    <option value="">-- Film * --</option>
                    {films.map((f) => (
                        <option key={f.fi_id} value={f.fi_id}>{f.fi_title}</option>
                    ))}
                </select>

                <select name="room" value={form.room} onChange={handleChange} required>
                    <option value="">-- Salle * --</option>
                    {rooms.map((r) => (
                        <option key={r.ro_id} value={r.ro_id}>{r.ro_name}</option>
                    ))}
                </select>

                <input name="datetime" type="datetime-local" value={form.datetime} onChange={handleChange} required />
                <input name="price" type="number" step="0.01" placeholder="Prix (€) *" value={form.price} onChange={handleChange} required />
                <button type="submit">Ajouter la séance</button>
            </form>

            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}

            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Film</th>
                        <th>Date</th>
                        <th>Salle</th>
                        <th>Prix</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {screenings.map((s) => (
                        <tr key={s.sc_id}>
                            <td>{s.fi_title}</td>
                            <td>{formatDate(s.sc_datetime)}</td>
                            <td>{s.ro_name}</td>
                            <td>{s.sc_price} €</td>
                            <td>
                                <button className="danger" onClick={() => handleDelete(s.sc_id)}>Supprimer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}

export default AdminScreenings;

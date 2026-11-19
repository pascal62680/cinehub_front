import { useState, useEffect } from "react";
import { apiFetch } from "../api.js";

const EMPTY_FILM = { title: "", duration: "", genre: "", release_date: "", description: "" };

function AdminFilms() {
    const [films, setFilms] = useState([]);
    const [form, setForm] = useState(EMPTY_FILM);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [refresh, setRefresh] = useState(0); // +1 = "recharge la liste"

    // Charge TOUS les films (même ceux retirés de l'affiche)
    useEffect(() => {
        async function loadFilms() {
            const { ok, data } = await apiFetch("/films");
            if (ok) setFilms(data);
            else setError(data.error);
        }
        loadFilms();
    }, [refresh]);

    // Un seul handleChange pour tous les champs, grâce à leur attribut "name"
    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleCreate(e) {
        e.preventDefault();
        setMessage("");
        setError("");

        const { ok, data } = await apiFetch("/films", {
            method: "POST",
            body: JSON.stringify({
                title: form.title,
                duration: Number(form.duration),
                genre: form.genre || null,
                release_date: form.release_date || null,
                description: form.description || null
            })
        });

        if (!ok) {
            setError(data.error); // ex : "La durée doit être un nombre entier positif"
            return;
        }
        setMessage("Film créé !");
        setForm(EMPTY_FILM);       // vide le formulaire
        setRefresh(refresh + 1);   // recharge la liste
    }

    // À l'affiche → retirer (DELETE = soft delete) ; retiré → remettre (PATCH)
    async function toggleShowing(film) {
        setMessage("");
        setError("");

        const { ok, data } = film.fi_is_showing
            ? await apiFetch(`/films/${film.fi_id}`, { method: "DELETE" })
            : await apiFetch(`/films/${film.fi_id}`, {
                  method: "PATCH",
                  body: JSON.stringify({ is_showing: 1 })
              });

        if (!ok) {
            setError(data.error);
            return;
        }
        setRefresh(refresh + 1);
    }

    return (
        <section className="admin-section">
            <h2>Films</h2>

            <form className="admin-form" onSubmit={handleCreate}>
                <input name="title" placeholder="Titre *" value={form.title} onChange={handleChange} required />
                <input name="duration" type="number" placeholder="Durée (min) *" value={form.duration} onChange={handleChange} required />
                <input name="genre" placeholder="Genre" value={form.genre} onChange={handleChange} />
                <input name="release_date" type="date" value={form.release_date} onChange={handleChange} />
                <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
                <button type="submit">Ajouter le film</button>
            </form>

            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}

            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Titre</th>
                        <th>Genre</th>
                        <th>Durée</th>
                        <th>À l'affiche</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {films.map((film) => (
                        <tr key={film.fi_id}>
                            <td>{film.fi_title}</td>
                            <td>{film.fi_genre}</td>
                            <td>{film.fi_duration} min</td>
                            <td>{film.fi_is_showing ? "✅ oui" : "❌ non"}</td>
                            <td>
                                <button onClick={() => toggleShowing(film)}>
                                    {film.fi_is_showing ? "Retirer" : "Remettre"}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}

export default AdminFilms;

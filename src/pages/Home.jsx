import { useState, useEffect } from "react";
import { Link } from "react-router";
import { apiFetch } from "../api.js";

function Home() {
    const [films, setFilms] = useState([]);       // la liste, vide au départ
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true); // "en cours de chargement"

    // Au premier affichage de la page : on demande les films à l'API
    useEffect(() => {
        async function loadFilms() {
            try {
                const { ok, status, data } = await apiFetch("/films/showing");

                if (status === 401) {
                    setError("Connectez-vous pour voir les films.");
                } else if (!ok) {
                    setError(data.error);
                } else {
                    setFilms(data);
                }
            } catch {
                setError("Impossible de contacter le serveur");
            }
            setLoading(false);
        }

        loadFilms();
    }, []);

    if (loading) return <p>Chargement…</p>;

    if (error) {
        return (
            <div>
                <p className="error">{error}</p>
                <Link to="/login">Aller à la connexion</Link>
            </div>
        );
    }

    return (
        <div>
            <h1>Films à l'affiche</h1>

            <div className="film-grid">
                {films.map((film) => (
                    <div className="film-card" key={film.fi_id}>
                        <h2>{film.fi_title}</h2>
                        <p className="film-meta">
                            {film.fi_genre} · {film.fi_duration} min
                        </p>
                        <p>{film.fi_description}</p>
                        <Link to={`/films/${film.fi_id}`}>Voir les séances →</Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;

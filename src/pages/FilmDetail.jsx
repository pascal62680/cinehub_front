import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { apiFetch } from "../api.js";
import ScreeningItem from "../components/ScreeningItem.jsx";

function FilmDetail() {
    const { id } = useParams(); // le numéro dans l'adresse /films/1
    const [film, setFilm] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadFilm() {
            try {
                const { ok, data } = await apiFetch(`/films/${id}`);
                if (!ok) {
                    setError(data.error); // ex : "Film introuvable" (404)
                } else {
                    setFilm(data);
                }
            } catch {
                setError("Impossible de contacter le serveur");
            }
        }

        loadFilm();
    }, [id]);

    if (error) return <p className="error">{error}</p>;
    if (!film) return <p>Chargement…</p>;

    return (
        <div>
            <Link to="/">← Retour aux films</Link>

            <h1>{film.fi_title}</h1>
            <p className="film-meta">
                {film.fi_genre} · {film.fi_duration} min · sorti le {film.fi_release_date}
            </p>
            <p>{film.fi_description}</p>

            <h2>Prochaines séances</h2>

            {film.screenings.length === 0 ? (
                <p>Aucune séance prévue pour ce film.</p>
            ) : (
                <ul className="screening-list">
                    {film.screenings.map((s) => (
                        <ScreeningItem key={s.sc_id} screening={s} />
                    ))}
                </ul>
            )}
        </div>
    );
}

export default FilmDetail;

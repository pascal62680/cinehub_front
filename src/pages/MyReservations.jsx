import { useState, useEffect } from "react";
import { apiFetch } from "../api.js";
import { formatDate } from "../format.js";
import ConfirmModal from "../components/ConfirmModal.jsx";

function MyReservations() {
    const [reservations, setReservations] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [toCancel, setToCancel] = useState(null); // id de la réservation à annuler

    // Au chargement : mes réservations
    useEffect(() => {
        async function loadReservations() {
            try {
                const { ok, status, data } = await apiFetch("/reservations/me");
                if (status === 401) {
                    setError("Connectez-vous pour voir vos réservations.");
                } else if (!ok) {
                    setError(data.error);
                } else {
                    setReservations(data);
                }
            } catch {
                setError("Impossible de contacter le serveur");
            }
            setLoading(false);
        }

        loadReservations();
    }, []);

    // Annuler une réservation
    async function handleCancel() {
        const id = toCancel;
        setToCancel(null); // ferme la modale

        const { ok, data } = await apiFetch(`/reservations/${id}`, { method: "DELETE" });

        if (!ok) {
            setError(data.error);
            return;
        }

        // On retire la réservation de la liste affichée, sans recharger
        setReservations(reservations.filter((r) => r.re_id !== id));
    }

    if (loading) return <p>Chargement…</p>;

    return (
        <div>
            <h1>Mes réservations</h1>

            {error && <p className="error">{error}</p>}

            {reservations.length === 0 ? (
                <p>Vous n'avez aucune réservation.</p>
            ) : (
                <ul className="screening-list">
                    {reservations.map((r) => (
                        <li key={r.re_id}>
                            <div className="screening-row">
                                <strong>{r.fi_title}</strong>
                                <span>{formatDate(r.sc_datetime)}</span>
                                <span>{r.ro_name}</span>
                                <span>{r.re_seats} place(s)</span>
                                <button className="danger" onClick={() => setToCancel(r.re_id)}>
                                    Annuler
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {toCancel && (
                <ConfirmModal
                    title="Annuler la réservation ?"
                    message="Les places seront libérées pour d'autres spectateurs."
                    confirmLabel="Annuler la réservation"
                    onConfirm={handleCancel}
                    onCancel={() => setToCancel(null)}
                />
            )}
        </div>
    );
}

export default MyReservations;

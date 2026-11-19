import { useState } from "react";
import { apiFetch } from "../api.js";
import { formatDate } from "../format.js";


// Une séance, avec son propre formulaire de réservation
function ScreeningItem({ screening }) {
    const [seats, setSeats] = useState(1);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [sending, setSending] = useState(false);

    async function handleReserve() {
        setMessage("");
        setError("");
        setSending(true);

        try {
            const { ok, data } = await apiFetch("/reservations", {
                method: "POST",
                body: JSON.stringify({ screening: screening.sc_id, seats: Number(seats) })
            });

            if (ok) {
                setMessage("Réservation confirmée ! Un e-mail de confirmation vous a été envoyé.");
            } else {
                setError(data.error); // ex : "Plus assez de places disponibles"
            }
        } catch {
            setError("Impossible de contacter le serveur");
        }

        setSending(false);
    }

    return (
        <li>
            <div className="screening-row">
                <strong>{formatDate(screening.sc_datetime)}</strong>
                <span>{screening.ro_name}</span>
                <span>{screening.sc_price} €</span>
                <input
                    type="number"
                    min="1"
                    className="seats-input"
                    value={seats}
                    onChange={(e) => setSeats(e.target.value)}
                />
                <button onClick={handleReserve} disabled={sending}>
                    {sending ? "Envoi…" : "Réserver"}
                </button>
            </div>

            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}
        </li>
    );
}

export default ScreeningItem;

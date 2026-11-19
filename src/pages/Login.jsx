import { useState } from "react";
import { useNavigate } from "react-router";
import { apiFetch } from "../api.js";

function Login({ onLogin }) {

    // Ce que l'utilisateur tape, et le message d'erreur éventuel
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Au clic sur "Se connecter"
    async function handleSubmit(e) {
        e.preventDefault(); // empêche le rechargement de la page
        setError("");

        try {
            const { ok, data } = await apiFetch("/auth/login", {
                method: "POST",
                body: JSON.stringify({ username, password })
            });

            if (!ok) {
                setError(data.error); // ex : "Identifiants incorrects"
                return;
            }

            onLogin(data.token); // on prévient App, qui garde le token
            navigate("/"); // direction la page des films
        } catch {
            setError("Impossible de contacter le serveur");
        }
    }

    return (
        <div className="form-card">
            <h1>Connexion</h1>

            <form onSubmit={handleSubmit}>
                <label>
                    Nom d'utilisateur
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </label>

                <label>
                    Mot de passe
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>

                {error && <p className="error">{error}</p>}

                <button type="submit">Se connecter</button>
            </form>
        </div>
    );
}

export default Login;

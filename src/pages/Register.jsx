import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { apiFetch } from "../api.js";

function Register({ onLogin }) {
    const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
    const [error, setError] = useState("");
    const [sending, setSending] = useState(false);
    const navigate = useNavigate();

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        // Vérification côté front : les 2 mots de passe doivent être identiques
        if (form.password !== form.confirm) {
            setError("Les deux mots de passe ne sont pas identiques");
            return;
        }

        setSending(true);
        try {
            // 1. Création du compte
            const { ok, data } = await apiFetch("/auth/register", {
                method: "POST",
                body: JSON.stringify({
                    username: form.username,
                    email: form.email,
                    password: form.password
                })
            });

            if (!ok) {
                setError(data.error); // ex : "Email invalide"
                setSending(false);
                return;
            }

            // 2. Connexion automatique avec le nouveau compte
            const login = await apiFetch("/auth/login", {
                method: "POST",
                body: JSON.stringify({ username: form.username, password: form.password })
            });

            if (login.ok) {
                onLogin(login.data.token);
                navigate("/");
            } else {
                navigate("/login");
            }
        } catch {
            setError("Impossible de contacter le serveur");
            setSending(false);
        }
    }

    return (
        <div className="form-card">
            <h1>Créer un compte</h1>

            <form onSubmit={handleSubmit}>
                <label>
                    Nom d'utilisateur
                    <input name="username" value={form.username} onChange={handleChange} required />
                </label>

                <label>
                    E-mail
                    <input name="email" type="email" value={form.email} onChange={handleChange} required />
                </label>

                <label>
                    Mot de passe
                    <input name="password" type="password" value={form.password} onChange={handleChange} required />
                </label>

                <label>
                    Confirmer le mot de passe
                    <input name="confirm" type="password" value={form.confirm} onChange={handleChange} required />
                </label>

                {error && <p className="error">{error}</p>}

                <button type="submit" disabled={sending}>
                    {sending ? "Création…" : "Créer mon compte"}
                </button>
            </form>

            <p className="form-switch">
                Déjà un compte ? <Link to="/login">Se connecter</Link>
            </p>
        </div>
    );
}

export default Register;

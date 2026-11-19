import { useState } from "react";
import { Routes, Route } from "react-router";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import MyReservations from "./pages/MyReservations.jsx";
import NotFound from "./pages/NotFound.jsx";
import "./App.css";

function App() {
    // Le token est gardé ici, chez le parent, pour être partagé
    const [token, setToken] = useState(localStorage.getItem("token"));

    function handleLogin(newToken) {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    }

    function handleLogout() {
        localStorage.removeItem("token");
        setToken(null);
    }

    return (
        <>
            <Navbar token={token} onLogout={handleLogout} />
            <main className="container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route path="/reservations" element={<MyReservations />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
        </>
    );
}

export default App;

import { useNavigate } from "react-router-dom";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <main className="profile-page">
            <section className="profile-content">
                <h1>404</h1>
                <p className="profile-subtitle">
                    Cette page n'existe pas.
                </p>

                <button
                    className="create-button"
                    onClick={() => navigate("/profiles")}
                >
                    Retour aux profils
                </button>
            </section>
        </main>
    );
}

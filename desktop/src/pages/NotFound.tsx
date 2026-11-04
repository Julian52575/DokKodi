import { useNavigate } from "react-router-dom";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <main className="profile-page">
            <section className="profile-content">
                <h1>404</h1>
                <p className="profile-subtitle">
                    Not Found. The page you are looking for does not exist.
                </p>

                <button
                    className="create-button"
                    onClick={() => navigate("/profiles")}
                >
                    Back to Profiles
                </button>
            </section>
        </main>
    );
}

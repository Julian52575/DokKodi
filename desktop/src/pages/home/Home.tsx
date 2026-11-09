
import { useLocation } from "react-router-dom";

export default function Home({ onChangeProfile }) {
    const location = useLocation();
    const profile = location.state?.profile;

    return (
        <main style={{
            minHeight: "100vh",
            background: "#0F1117",
            color: "#FFFFFF",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Inter, sans-serif",
        }}>
            <h1>Bienvenue sur DokKodi</h1>

            {profile && (
                <p>
                    Bonjour {profile.name} {profile.avatar}
                </p>
            )}

            <button onClick={onChangeProfile}>
                Changer de profil
            </button>
        </main>
    );
}

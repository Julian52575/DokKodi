
import { useRef, useState } from "react";
import "./ProfilePages.css";

const DEFAULT_PROFILES = [
    { id: 1, name: "Arthur", avatar: "A", color: "#3B82F6", isChild: false },
    { id: 2, name: "Antoine", avatar: "A", color: "#8B5CF6", isChild: false },
    { id: 3, name: "Rulian", avatar: "R", color: "#10B981", isChild: false },
];

const AVATARS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
const COLORS = [
    "#3B82F6",
    "#8B5CF6",
    "#10B981",
    "#EF4444",
    "#F59E0B",
    "#EC4899",
];

export default function ProfilePages({
    initialProfiles = DEFAULT_PROFILES,
    onSelectProfile = () => {},
    onCreateProfile = () => {},
}) {
    const [profiles, setProfiles] = useState(initialProfiles);
    const [page, setPage] = useState("select");

    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState(AVATARS[0]);
    const [color, setColor] = useState(COLORS[0]);
    const [isChild, setIsChild] = useState(false);

    const nameInputRef = useRef(null);

    const resetForm = () => {
        setName("");
        setAvatar(AVATARS[0]);
        setColor(COLORS[0]);
        setIsChild(false);
    };

    const openCreation = () => {
        resetForm();
        setPage("create");
    };

    const goBack = () => {
        setPage("select");
    };

    const handleCreate = (event) => {
        event.preventDefault();

        const trimmedName = name.trim();

        if (!trimmedName) return;

        const newProfile = {
            id: Date.now(),
            name: trimmedName,
            avatar,
            color,
            isChild,
        };

        setProfiles((previous) => [...previous, newProfile]);
        onCreateProfile(newProfile);

        resetForm();
        setPage("select");
    };

    const handleSelect = (profile) => {
        onSelectProfile(profile);
    };

    const handleProfileKeyDown = (event) => {
        const directions = [
            "ArrowRight",
            "ArrowLeft",
            "ArrowDown",
            "ArrowUp",
        ];

        if (!directions.includes(event.key)) return;

        const container = event.currentTarget.parentElement;
        const cards = Array.from(
            container.querySelectorAll("[data-profile]")
        );

        const currentIndex = cards.indexOf(event.currentTarget);

        const columns = Math.max(
            1,
            Math.floor(container.clientWidth / 190)
        );

        const offsets = {
            ArrowRight: 1,
            ArrowLeft: -1,
            ArrowDown: columns,
            ArrowUp: -columns,
        };

        const nextIndex = currentIndex + offsets[event.key];

        if (nextIndex >= 0 && nextIndex < cards.length) {
            event.preventDefault();
            cards[nextIndex].focus();
        }
    };

    return (
        <main className="profile-page">
            <header className="profile-header">
                <div className="profile-logo">
                    <span className="logo-symbol">D</span>
                    <span className="logo-name">Dok<span>Kodi</span></span>
                </div>
            </header>

            {page === "select" ? (
                <section className="profile-content">
                    <h1>Qui regarde DokKodi ?</h1>
                    <p className="profile-subtitle">
                        Sélectionnez votre profil pour continuer.
                    </p>

                    <div className="profile-grid">
                        {profiles.map((profile) => (
                            <button
                                key={profile.id}
                                className="profile-card"
                                data-profile
                                onClick={() => handleSelect(profile)}
                                onKeyDown={handleProfileKeyDown}
                                aria-label={`Sélectionner le profil ${profile.name}`}
                            >
                                <div
                                    className="profile-avatar"
                                    style={{ "--avatar-color": profile.color }}
                                >
                                    <span>{profile.avatar}</span>

                                    {profile.isChild && (
                                        <span className="child-badge">
                                            Enfant
                                        </span>
                                    )}
                                </div>

                                <span className="profile-name">
                                    {profile.name}
                                </span>
                            </button>
                        ))}

                        <button
                            className="profile-card add-profile"
                            onClick={openCreation}
                            aria-label="Ajouter un profil"
                        >
                            <div className="add-avatar">
                                <span>+</span>
                            </div>
                            <span className="profile-name">
                                Ajouter un profil
                            </span>
                        </button>
                    </div>

                    <p className="profile-hint">
                        Utilisez les flèches pour naviguer et Entrée pour
                        sélectionner.
                    </p>
                </section>
            ) : (
                <section className="profile-content create-content">
                    <button
                        className="back-button"
                        onClick={goBack}
                    >
                        <span aria-hidden="true">←</span> Retour
                    </button>

                    <h1>Créer un profil</h1>
                    <p className="profile-subtitle">
                        Personnalisez votre expérience DokKodi.
                    </p>

                    <form
                        className="profile-form"
                        onSubmit={handleCreate}
                    >
                        <div className="avatar-preview">
                            <div
                                className="profile-avatar preview-avatar"
                                style={{ "--avatar-color": color }}
                            >
                                {avatar}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="profile-name">
                                Nom du profil
                            </label>
                            <input
                                ref={nameInputRef}
                                id="profile-name"
                                type="text"
                                value={name}
                                onChange={(event) =>
                                    setName(event.target.value)
                                }
                                placeholder="Ex : Arthur"
                                maxLength={24}
                                required
                                autoFocus
                            />
                        </div>

                        <div className="form-group">
                            <label>Choisir un avatar</label>
                            <div className="avatar-picker">
                                {AVATARS.map((item) => (
                                    <button
                                        key={item}
                                        type="button"
                                        className={`avatar-option ${
                                            avatar === item ? "selected" : ""
                                        }`}
                                        onClick={() => setAvatar(item)}
                                        aria-label={`Choisir l'avatar ${item}`}
                                        aria-pressed={avatar === item}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Couleur de l'avatar</label>
                            <div className="color-picker">
                                {COLORS.map((item) => (
                                    <button
                                        key={item}
                                        type="button"
                                        className={`color-option ${
                                            color === item ? "selected" : ""
                                        }`}
                                        style={{ backgroundColor: item }}
                                        onClick={() => setColor(item)}
                                        aria-label={`Choisir la couleur ${item}`}
                                        aria-pressed={color === item}
                                    />
                                ))}
                            </div>
                        </div>

                        <label className="child-option">
                            <input
                                type="checkbox"
                                checked={isChild}
                                onChange={(event) =>
                                    setIsChild(event.target.checked)
                                }
                            />
                            <span className="custom-checkbox" />
                            <span>
                                <strong>Profil enfant</strong>
                                <small>
                                    Activer les restrictions du contrôle parental.
                                </small>
                            </span>
                        </label>

                        <button
                            type="submit"
                            className="create-button"
                            disabled={!name.trim()}
                        >
                            Créer le profil
                        </button>
                    </form>
                </section>
            )}
        </main>
    );
}

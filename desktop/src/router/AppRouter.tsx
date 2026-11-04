
import {
    HashRouter,
    Routes,
    Route,
    Navigate,
    useNavigate,
} from "react-router-dom";

import ProfilePages from "../pages/profiles/ProfilePages";
import Home from "../pages/home/Home";
import NotFound from "../pages/NotFound";

export const ROUTES = {
    PROFILES: "/profiles",
    HOME: "/home",
    SETTINGS: "/settings",
} as const;

function ProfileRoute() {
    const navigate = useNavigate();

    return (
        <ProfilePages
            onSelectProfile={(profile) => {
                navigate(ROUTES.HOME, {
                    state: { profile },
                });
            }}
            onCreateProfile={(profile) => {
                console.log("Profil créé :", profile);
            }}
        />
    );
}

function HomeRoute() {
    const navigate = useNavigate();

    return (
        <Home
            onChangeProfile={() => navigate(ROUTES.PROFILES)}
        />
    );
}

export default function AppRouter() {
    return (
        <HashRouter>
            <Routes>
                <Route
                    path="/"
                    element={<Navigate to={ROUTES.PROFILES} replace />}
                />

                <Route
                    path={ROUTES.PROFILES}
                    element={<ProfileRoute />}
                />

                <Route
                    path={ROUTES.HOME}
                    element={<HomeRoute />}
                />

                <Route
                    path={ROUTES.SETTINGS}
                    element={<div>Paramètres DokKodi</div>}
                />

                <Route path="*" element={<NotFound />} />
            </Routes>
        </HashRouter>
    );
}

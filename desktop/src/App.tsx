import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

import AppRouter from "./router/AppRouter";

export default function App() {
    return <AppRouter />;
}
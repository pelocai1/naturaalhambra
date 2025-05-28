import React from "react";
import { useLocation } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  const location = useLocation();

  // Define las rutas que quieres que tengan fondo especial
  const isBackgroundPage = ["/login", "/register", "/contact"].includes(
    location.pathname
  );

  return (
    <div
      className={`app-wrapper d-flex flex-column min-vh-100 ${
        isBackgroundPage ? "auth-background" : ""
      }`}
    >
      <Navbar />
      <div className="flex-grow-1">
        <AppRouter />
      </div>
      <Footer />
    </div>
  );
}

export default App;

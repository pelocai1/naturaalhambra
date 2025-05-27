import React from "react";
import { useLocation } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/contact";

  return (
    <div
      className={`app-wrapper d-flex flex-column min-vh-100 ${
        isAuthPage ? "auth-background" : ""
      }`}
    >
      {!isAuthPage && <Navbar />}
      <div className="flex-grow-1">
        <AppRouter />
      </div>
      {!isAuthPage && <Footer />}
    </div>
  );
}

export default App;

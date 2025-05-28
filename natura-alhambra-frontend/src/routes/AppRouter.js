import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Houses from "../pages/Houses";
import Contact from "../pages/Contact";
import HouseDetails from "../pages/HouseDetails";
import UserReservations from "../pages/UserReservations";
import AdminPanel from "../pages/AdminPanel";
import ProtectedRoute from "../components/ProtectedRoute";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/houses" element={<Houses />} />
      <Route path="/contact" element={<Contact />} />

      <Route
        path="/houses/:id"
        element={
          <ProtectedRoute>
            <HouseDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reservations"
        element={
          <ProtectedRoute>
            <UserReservations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminPanel />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRouter;

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Houses from '../pages/Houses';
import HouseDetails from '../pages/HouseDetails';
import UserReservations from '../pages/UserReservations';
import PrivateRoute from '../components/PrivateRoute';
import AdminPanel from '../pages/AdminPanel';
import AdminRoute from '../components/AdminRoute';

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/houses" element={<Houses />} />
      <Route path="/houses/:id" element={<HouseDetails />} />

      {/* Rutas protegidas */}
      <Route
        path="/reservations"
        element={
          <PrivateRoute>
            <UserReservations />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminPanel />
          </AdminRoute>
        }
      />
    </Routes>
  );
}

export default AppRouter;

import { Navigate, Route, Routes } from 'react-router-dom';

import { AuthProvider } from './AuthContext';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import PetsPage from './pages/PetsPage';
import AuthPage from './pages/AuthPage';
import MyRequestsPage from './pages/MyRequestsPage';
import ShelterPage from './pages/ShelterPage';
import AdminDashboard from './pages/AdminDashboard';

function AppRoutes() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Public Home Page */}
        <Route
          path="/"
          element={<PetsPage />}
        />

        {/* Login Page */}
        <Route
          path="/login"
          element={<AuthPage mode="login" />}
        />

        {/* Registration Page */}
        <Route
          path="/register"
          element={<AuthPage mode="register" />}
        />

        {/* Adopter Dashboard: My Adoption Requests */}
        <Route element={<ProtectedRoute roles={['ADOPTER']} />}>
          <Route
            path="/my-requests"
            element={<MyRequestsPage />}
          />
        </Route>

        {/* Shelter Dashboard */}
        <Route element={<ProtectedRoute roles={['SHELTER', 'ADMIN']} />}>
          <Route
            path="/shelter"
            element={<ShelterPage />}
          />
        </Route>

        {/* Admin Dashboard: Admin Only */}
        <Route element={<ProtectedRoute roles={['ADMIN']} />}>
          <Route
            path="/admin"
            element={<AdminDashboard />}
          />
        </Route>

        {/* Redirect Unknown Routes */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>

      {/* Footer */}
      <footer className="site-footer">
        <span>🐾 PawHaven</span>
        <span>Small paws. Big love. © 2026</span>
      </footer>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
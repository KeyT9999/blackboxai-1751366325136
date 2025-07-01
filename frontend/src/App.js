import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import DashboardAdmin from './components/DashboardAdmin';
import DashboardUser from './components/DashboardUser';
import EmailDetail from './components/EmailDetail';

function App() {
  // For simplicity, authentication state and role can be managed here or via context
  // Placeholder for auth state
  const [auth, setAuth] = React.useState({ isAuthenticated: false, role: null });

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage setAuth={setAuth} />} />
        {auth.isAuthenticated && auth.role === 'admin' && (
          <Route path="/admin" element={<DashboardAdmin />} />
        )}
        {auth.isAuthenticated && auth.role === 'user' && (
          <Route path="/user" element={<DashboardUser />} />
        )}
        <Route path="/email/:id" element={<EmailDetail />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

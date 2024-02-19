import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import LoginForm from './pages/LoginForm';
import RegisterForm from './pages/RegisterForm';
import CommentsPage from './pages/CommentsPage'
import ProtectedRoute from './components/protectedRoute';
import PublicOnlyRoute from './components/publicOnlyRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute><CommentsPage /></ProtectedRoute>} />
        <Route path="/login" element={<PublicOnlyRoute><LoginForm /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><RegisterForm /></PublicOnlyRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
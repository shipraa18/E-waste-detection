

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicPage from './components/PublicPage';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';

const App = () => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || '');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicPage />} />
        <Route path="/login" element={authToken ? <Navigate to="/admin" /> : <Login setAuthToken={setAuthToken} />} />
        <Route path="/admin" element={authToken ? <AdminPanel authToken={authToken} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};
export default App;


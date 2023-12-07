// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {Dashboard} from './components/Dashboard1';
import {TextEditor} from './components/TextEditor';
import SignIn from './pages/SignIn';

export const App = () => {
  return (
    <Router>
        <Routes>
          {/* Default route: Dashboard if authenticated, otherwise Login page */}
          <Route path="/" element={<SignIn />} />
          <Route
            path="/dashboard"
            element={<Dashboard />}
            // Render the Dashboard only if authenticated, otherwise redirect to Login
            caseSensitive
          />
          <Route path="/text-editor/:noteid" element={<TextEditor />} />
        </Routes>
    </Router>
  );
};

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar/Sidebar";
import People from "./body/people/people";
import Login from "./pages/Login";
import ProtectedRoute from "./pages/ProtectedRoute";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="dashboard-layout">
                <Sidebar />
                <div style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  paddingLeft: 32,
                  paddingRight: 32,
                  paddingTop: 48,
                  paddingBottom: 20,
                  height: '100vh',
                  overflow: 'hidden'
                }}>
                  {/* <Header /> */}
                  <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'auto'
                  }}>
                    <People />
                  </div>
                  <Footer />
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

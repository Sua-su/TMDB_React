import React from "react";
import {
  BrowserRouter as Router,
  NavLink,
  Route,
  Routes,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css";

import "./App.css";

import SearchPage from "./components/Pages/SearchPage";
import Home from "./components/Pages/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import MovieDetailPage from "./components/Pages/MovieDetailPage";
import BoardListPage from "./components/Pages/BoardListPage";
import BoardDetailPage from "./components/Pages/BoardDetailPage";
import BoardPostDetailPage from "./components/Pages/BoardPostDetailPage";
import Navbar from "./components/home/Navbar";

import { AuthProvider } from "./components/context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="container-fluid px-0 bg-dark min-vh-100">
          <div className="row g-0">
            <div className="col-12">
              <div className="row g-0">
                <div className="col-12">
                  <div id="header-container">
                    <NavLink to="/" id="logo-link">
                      <img src={require('./css/images/logo.png')} alt="TMRB Logo" id="logo" />
                    </NavLink>
                    <h1 className="text-center" style={{flexGrow: 1}}>
                      <NavLink to="/" className="text-white text-decoration-none">
                        TMRB
                      </NavLink>
                    </h1>
                  </div>
                </div>
              </div>
              <div className="row g-0">
                <div className="col-12">
                  <Navbar />
                </div>
              </div>
              <div className="row g-0">
                <div className="col-12">
                  <div className="content-area">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/search/*" element={<SearchPage />} />
                      <Route
                        path="/movie/:movieId"
                        element={<MovieDetailPage />}
                      />
                      <Route path="/boards" element={<BoardListPage />} />
                      <Route
                        path="/boards/:boardId"
                        element={<BoardDetailPage />}
                      />
                      <Route
                        path="/boards/:boardId/post/:postId"
                        element={<BoardPostDetailPage />}
                      />
                    </Routes>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

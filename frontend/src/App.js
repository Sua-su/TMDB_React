import "./App.css";
import LoginPage from "./sign/login";
import SignUpPage from "./sign/sign";
import FindPasswordPage from "./sign/findPassward";
import { Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/findPassword" element={<FindPasswordPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;

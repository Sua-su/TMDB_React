import "./App.css";
import LoginPage from "./sign/login";
import SignUpPage from "./sign/sign";
import FindPasswordPage from "./sign/findPassward";
import MainPage from "./pages/MainPage";
import { Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/findPassword" element={<FindPasswordPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/" element={<Navigate to="/main" replace />} />
      </Routes>
    </div>
  );
}

export default App;

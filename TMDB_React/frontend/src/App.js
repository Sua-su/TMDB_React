import "./App.css";
import LoginPage from "./sign/login";
import SignUpPage from "./sign/sign";
import FindPasswordPage from "./sign/findPassward";
import MainPage from "./pages/MainPage";
import ReviewList from './reviews/ReviewList'; 
import ReviewWrite from './reviews/ReviewWrite';
import ReviewDetail from './reviews/ReviewDetail';
import ReviewEdit from './reviews/ReviewEdit';
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

        <Route path="/review" element={<ReviewList />} />
        <Route path="/review/write" element={<ReviewWrite />} />
        <Route path="/review/:boardNo" element={<ReviewDetail />} />
        <Route path="/review/edit/:boardNo" element={<ReviewEdit />} />
      </Routes>
    </div>
  );
}

export default App;

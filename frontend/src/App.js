import "./App.css";
import LoginPage from "./sign/login";
import SignUpPage from "./sign/sign";
import FindPasswordPage from "./sign/findPassward";
import MainPage from "./pages/MainPage";
import MovieDetailPage from "./pages/MovieDetailPage";
import MyPage from "./pages/MyPage";
import TVListPage from "./pages/TVListPage";
import TVDetailPage from "./pages/TVDetailPage";
import ActorPage from "./pages/ActorPage";
import ReviewList from "./reviews/ReviewList";
import ReviewWrite from "./reviews/ReviewWrite";
import ReviewDetail from "./reviews/ReviewDetail";
import ReviewEdit from "./reviews/ReviewEdit";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/findPassword" element={<FindPasswordPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/movie/:id" element={<MovieDetailPage />} />
          <Route path="/tv" element={<TVListPage />} />
          <Route path="/tv/:id" element={<TVDetailPage />} />
          <Route path="/actor/:id" element={<ActorPage />} />
          <Route path="/mypage" element={<ProtectedRoute><MyPage /></ProtectedRoute>} />
          <Route path="/reviews" element={<ReviewList />} />
          <Route path="/reviews/write" element={<ProtectedRoute><ReviewWrite /></ProtectedRoute>} />
          <Route path="/reviews/:boardNo" element={<ReviewDetail />} />
          <Route path="/reviews/edit/:boardNo" element={<ProtectedRoute><ReviewEdit /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/main" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;

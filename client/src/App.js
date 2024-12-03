import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/RegisterLogin/Register";
import Login from "./pages/RegisterLogin/Login";
import Home from "./pages/Home/Home";
import LeaderboardPage from "./pages/Leaderboard/Leaderboard";
import Friends from "./pages/Friends/Friends";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/friends" element={<Friends />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

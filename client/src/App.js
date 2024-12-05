import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/RegisterLogin/Register";
import Login from "./pages/RegisterLogin/Login";
import Home from "./pages/Home/Home";
import LeaderboardPage from "./pages/Leaderboard/Leaderboard";
import Friends from "./pages/Friends/Friends";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Quiz from "./pages/Quiz/Quiz";

function App() {

  const queryClient = new QueryClient();

  return (
  <QueryClientProvider client={queryClient}>  
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/quiz/:quizId" element={<Quiz />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
  );
}

export default App;

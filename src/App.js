import "./App.css";
import Main from "./components/Main";
import { Routes, Route } from "react-router-dom";
import Song from "./components/Song";
import Chart from "./components/Chart";
import NotFound from "./components/NotFound";
import MyPage from "./components/MyPage";
import PlayList from "./components/PlayList";
import UserList from "./components/UserList";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/song" element={<Song />} />
      <Route path="/chart" element={<Chart />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/userlist" element={<UserList />} />
      <Route path="/playlist/:id" element={<PlayList />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

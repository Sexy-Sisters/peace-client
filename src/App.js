import "./App.css";
import Main from "./components/Main";
import { Routes, Route } from "react-router-dom";
import Song from "./components/Song";
import Chart from "./components/Chart";
import NotFound from "./components/NotFound";
import MyPage from "./components/MyPage";
import PlayList from "./components/PlayList";
import UserList from "./components/UserList";
import { useEffect } from "react";
import { instance } from "./instance/instance";
import { userState } from "./atom";
import { useRecoilState } from "recoil";


function App() {
  const [user, setUser] = useRecoilState(userState);
  useEffect(() => {
    if (localStorage.getItem('access-token')) {
      (async () => {
        try {
          const loginResponse = await instance.get("user/profile", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access-token')}`,
            },
          });
          console.log(loginResponse.data);
          setUser(loginResponse.data);
        } catch (error) {
          console.log(error);
        }
      })()
    }
  }, []);
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

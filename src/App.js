import "./App.css";
import { Chart, Main, MyPage, NotFound, PlayList, Song, UserList } from './allFiles';
import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { instance } from "./instance/instance";
import { SnackbarState, userState } from "./atom.js";
import { useRecoilState } from "recoil";
import ExpirationToken from "./function/ExpirationToken";
import Test from "./components/SnackBar";
import SnackBar from "./components/SnackBar";

function App() {
  const [user, setUser] = useRecoilState(userState);
  const [snackbar, setSnackbar] = useRecoilState(SnackbarState);
  if (new Date().getHours() === 0 && new Date().getMinutes() === 0) {
    if (localStorage.getItem('access-token')) {
      const setUserInfo = async () => {
        try {
          const loginResponse = await instance.get("user/profile", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access-token')}`,
            },
          });
          setUser(loginResponse.data);
        } catch (error) {
          console.log(error);
          ExpirationToken(error.response.data.message, setUserInfo);
        }
      }
      setUserInfo();
    }
  }
  useEffect(() => {
    if (localStorage.getItem('access-token')) {
      const setUserInfo = async () => {
        try {
          const loginResponse = await instance.get("user/profile", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access-token')}`,
            },
          });
          setUser(loginResponse.data);
        } catch (error) {
          console.log(error);
          ExpirationToken(error.response.data.message, setUserInfo);
          setSnackbar({
            isOpen: true,
            message: error.response.data.message
          })
        }
      }
      setUserInfo();
    }
  }, []);
  return (
    <>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/song" element={<Song />} />
        <Route path="/chart" element={<Chart />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/userlist" element={<UserList />} />
        <Route path="/playlist/:id" element={<PlayList />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <SnackBar />
    </>
  );
}

export default App;

import "./App.css";
import Main from "./components/Main";
import { Routes, Route } from "react-router-dom";
import Song from "./components/Song";
import Chart from "./components/Chart";
import NotFound from "./components/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/song" element={<Song />} />
      <Route path="/chart" element={<Chart />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

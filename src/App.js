import "./App.css";
import Main from "./components/Main";
import { Routes, Route } from "react-router-dom";
import Apply from "./components/Apply";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/apply" element={<Apply/>}/>
    </Routes>
  );
}

export default App;

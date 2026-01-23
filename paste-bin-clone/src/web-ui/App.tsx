import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EntryView from "./pages/EntryView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/entries/:id" element={<EntryView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

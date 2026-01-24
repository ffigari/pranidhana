import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/home";
import EntryView from "./pages/EntryView";
import { API } from "./api";
import { Navigator } from "./types";

const api = new API();

function HomeWrapper() {
    const navigate = useNavigate();
    const navigator: Navigator = {
        navigate: (path: string) => navigate(path),
    };

    return <Home api={api} navigator={navigator} />;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomeWrapper />} />
                <Route path="/entries/:id" element={<EntryView />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

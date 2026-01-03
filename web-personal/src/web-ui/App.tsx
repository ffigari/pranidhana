import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Home from "./home";
import Log from "./log";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/i" element={<Home />} />
                <Route path="/log" element={<Log />} />
                <Route path="*" element={<Navigate to="/i" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

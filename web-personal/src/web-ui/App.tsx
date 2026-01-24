import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Home from "./home";
import Log from "./log";
import Portfolio from "./portfolio";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/i" element={<Home />} />
                <Route path="/i/portfolio" element={<Portfolio />} />
                <Route path="/log" element={<Log />} />
                <Route path="*" element={<Navigate to="/i" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

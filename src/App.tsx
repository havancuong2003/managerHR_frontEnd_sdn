import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Forbidden403, Login, NotFound, Register } from "./pages";

function App() {
    return (
        <Router basename="/managerHR">
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forbidden" element={<Forbidden403 />} />
                <Route path="/*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;

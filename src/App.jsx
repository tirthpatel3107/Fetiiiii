import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";

// components
import NewCode from "./pages/new/Dashboard";
import OldCode from "./pages/old/Dashboard";

// styles
import "./index.css";
import "./assets/styles/old.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NewCode />} />
        <Route path="/old-code" element={<OldCode />} />
      </Routes>
    </Router>
  );
}

createRoot(document.getElementById("root")).render(<App />);

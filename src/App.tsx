import { Navigate, Route, Routes } from "react-router-dom";
import About from "./routes/About";
import Analyzer from "./routes/Analyzer";
import { LensProvider } from "./components/LensContext";
import Layout from "./components/Layout";
import { ThemeProvider } from "./components/ThemeContext";
import FakeOrNot from "./routes/FakeOrNot";
import Home from "./routes/Home";
import Methodology from "./routes/Methodology";
import Result from "./routes/Result";
import Trending from "./routes/Trending";

function App() {
  return (
    <ThemeProvider>
      <LensProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/result/:topic" element={<Result />} />
            <Route path="/analyzer" element={<Analyzer />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/fake-or-not" element={<FakeOrNot />} />
            <Route path="/methodology" element={<Methodology />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </LensProvider>
    </ThemeProvider>
  );
}

export default App;

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import VideoUpload from "./components/VideoUpload";
import BlogList from "./components/BlogList";
import TextTranscribe from "./components/TextTranscribe";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/blogs" />} />
        
        {/* Routes for components */}
        <Route path="/upload" element={<VideoUpload />} />
        <Route path="/blogs" element={<BlogList />} />
        <Route path="/transcribe" element={<TextTranscribe />} />
        
        {/* Catch-All Route for 404 */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

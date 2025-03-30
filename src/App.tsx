import { Route, Routes } from "react-router";
import { Home } from "./pages/Home";
import { Navbar } from "./components/Navbar";
import { CreatePostPage } from "./pages/CreatePostPage";
import { PostPage } from "./pages/PostPage";
import { CreateCommunityPage } from "./pages/CreateCommunityPage";
import { CommunitiesPage } from "./pages/CommunitiesPage";
import { CommunityPage } from "./pages/CommunityPage";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100 transition-all duration-700">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none" />
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-7xl relative">
        <div className="glass-effect glass-effect-hover rounded-2xl p-8 shadow-xl animate-glow">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-green-500/5 rounded-2xl" />
          <div className="relative">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create" element={<CreatePostPage />} />
              <Route path="/post/:id" element={<PostPage />} />
              <Route path="/community/create" element={<CreateCommunityPage />} />
              <Route path="/communities" element={<CommunitiesPage />} />
              <Route path="/community/:id" element={<CommunityPage />} />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

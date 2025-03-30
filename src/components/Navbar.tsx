import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { signInWithGitHub, signOut, user } = useAuth();

  const displayName = user?.user_metadata.user_name || user?.email;
  return (
    <nav className="fixed top-0 w-full z-40 glass-effect border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="font-mono text-2xl font-bold text-gradient hover-lift animate-float">
            vibe<span className="text-green-500">.hub</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <Link
                  to="/create"
                  className="text-gray-300 hover:text-white transition-colors hover-lift relative group"
                >
                  Create Post
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300" />
                </Link>
                <Link
                  to="/communities"
                  className="text-gray-300 hover:text-white transition-colors hover-lift relative group"
                >
                  Communities
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300" />
                </Link>
                <Link
                  to="/community/create"
                  className="text-gray-300 hover:text-white transition-colors hover-lift relative group"
                >
                  Create Community
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 group-hover:w-full transition-all duration-300" />
                </Link>
              </>
            ) : null}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {user.user_metadata?.avatar_url && (
                  <div className="relative group">
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/50 hover-lift transition-all duration-300 group-hover:ring-blue-500"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                )}
                <span className="text-gray-300 font-medium">{displayName}</span>
                <button
                  onClick={signOut}
                  className="bg-red-500/80 hover:bg-red-500 px-4 py-2 rounded-lg transition-all duration-300 hover-lift hover:shadow-lg hover:shadow-red-500/20"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={signInWithGitHub}
                className="bg-blue-500/80 hover:bg-blue-500 px-4 py-2 rounded-lg transition-all duration-300 hover-lift hover:shadow-lg hover:shadow-blue-500/20 flex items-center space-x-2 group"
              >
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span>Sign in with GitHub</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-gray-300 hover:text-white focus:outline-none hover-lift transition-colors duration-300"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden glass-effect">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300 hover-lift"
            >
              Home
            </Link>
            <Link
              to="/create"
              className="block px-3 py-2 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300 hover-lift"
            >
              Create Post
            </Link>
            <Link
              to="/communities"
              className="block px-3 py-2 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300 hover-lift"
            >
              Communities
            </Link>
            <Link
              to="/community/create"
              className="block px-3 py-2 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300 hover-lift"
            >
              Create Community
            </Link>
            {user ? (
              <button
                onClick={signOut}
                className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-400 hover:text-red-300 hover:bg-white/5 transition-all duration-300 hover-lift"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={signInWithGitHub}
                className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-blue-400 hover:text-blue-300 hover:bg-white/5 transition-all duration-300 hover-lift"
              >
                Sign in with GitHub
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

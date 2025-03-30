import { Link } from "react-router";
import { Post } from "./PostList";

interface Props {
  post: Post;
}

export const PostItem = ({ post }: Props) => {
  return (
    <div className="relative group">
      {/* Gradient border effect */}
      <div className="absolute -inset-1 rounded-[20px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none animate-gradient"></div>
      
      <Link to={`/post/${post.id}`} className="block relative z-10">
        <div className="w-80 h-76 glass-effect rounded-[20px] text-white flex flex-col p-5 overflow-hidden transition-all duration-500 group-hover:scale-[1.02]">
          {/* Header: Avatar and Title */}
          <div className="flex items-center space-x-3">
            <div className="relative group/avatar">
              {post.avatar_url ? (
                <img
                  src={post.avatar_url}
                  alt="User Avatar"
                  className="w-[40px] h-[40px] rounded-full object-cover ring-2 ring-blue-500/50 transition-all duration-300 group-hover/avatar:ring-blue-500"
                />
              ) : (
                <div className="w-[40px] h-[40px] rounded-full bg-gradient-to-tl from-blue-500 to-purple-500 animate-gradient" />
              )}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="flex flex-col flex-1">
              <div className="text-[20px] leading-[22px] font-semibold mt-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
                {post.title}{" "}
                {post.user_name && (
                  <span className="text-gray-400 group-hover:text-gray-300"> by {post.user_name}</span>
                )}
              </div>
            </div>
          </div>

          {/* Image Banner */}
          <div className="mt-3 flex-1 relative overflow-hidden rounded-[15px] group-hover:shadow-lg group-hover:shadow-blue-500/20 transition-all duration-500">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full rounded-[15px] object-cover max-h-[150px] mx-auto transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[15px]" />
          </div>

          {/* Interaction buttons */}
          <div className="flex justify-around items-center mt-4">
            <button className="group/btn flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-white/5">
              <span className="text-xl transform transition-transform duration-300 group-hover/btn:scale-110">❤️</span>
              <span className="font-medium">{post.like_count ?? 0}</span>
            </button>
            <button className="group/btn flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-white/5">
              <span className="text-xl transform transition-transform duration-300 group-hover/btn:scale-110">💬</span>
              <span className="font-medium">{post.comment_count ?? 0}</span>
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

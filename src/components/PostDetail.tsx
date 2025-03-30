import { useQuery } from "@tanstack/react-query";
import { Post } from "./PostList";
import { supabase } from "../supabase-client";
import { LikeButton } from "./LikeButton";
import { CommentSection } from "./CommentSection";

interface Props {
  postId: number;
}

const fetchPostById = async (id: number): Promise<Post> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return data as Post;
};

export const PostDetail = ({ postId }: Props) => {
  const { data, error, isLoading } = useQuery<Post, Error>({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-loading-bar w-48 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4 rounded-lg bg-red-500/10">
        Error: {error.message}
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-bold text-gradient">
          {data?.title}
        </h2>
        <div className="flex items-center justify-center space-x-4 text-gray-400">
          <span className="flex items-center space-x-2">
            {data?.avatar_url ? (
              <img
                src={data.avatar_url}
                alt={data.user_name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/50"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tl from-blue-500 to-purple-500 animate-gradient" />
            )}
            <span>{data?.user_name}</span>
          </span>
          <span>•</span>
          <span>{new Date(data!.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Image Section */}
      {data?.image_url && (
        <div className="relative group">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none animate-gradient"></div>
          <div className="relative overflow-hidden rounded-2xl">
            <img
              src={data.image_url}
              alt={data?.title}
              className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="glass-effect rounded-2xl p-6 space-y-6">
        <p className="text-gray-300 leading-relaxed text-lg">{data?.content}</p>
        
        {/* Like Button */}
        <div className="flex justify-center">
          <LikeButton postId={postId} />
        </div>
      </div>

      {/* Comments Section */}
      <div className="glass-effect rounded-2xl p-6">
        <CommentSection postId={postId} />
      </div>
    </article>
  );
};

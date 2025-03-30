import { useState } from "react";
import { Comment } from "./CommentSection";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Props {
  comment: Comment & {
    children?: Comment[];
  };
  postId: number;
}

const createReply = async (
  replyContent: string,
  postId: number,
  parentCommentId: number,
  userId?: string,
  author?: string
) => {
  if (!userId || !author) {
    throw new Error("You must be logged in to reply.");
  }

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    content: replyContent,
    parent_comment_id: parentCommentId,
    user_id: userId,
    author: author,
  });

  if (error) throw new Error(error.message);
};

export const CommentItem = ({ comment, postId }: Props) => {
  const [showReply, setShowReply] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [replyCommentError, setReplyCommentError] = useState<string>("");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (replyContent: string) =>
      createReply(
        replyContent,
        postId,
        comment.id,
        user?.id,
        user?.user_metadata?.user_name
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      setReplyText("");
      setShowReply(false);
      setReplyCommentError("");
    },
  });

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReplyCommentError("");
    if (!replyText) {
      setReplyCommentError("Reply cannot be empty.");
      return;
    }
    mutate(replyText);
  };

  return (
    <div className="relative pl-6 border-l-2 border-white/10 group">
      {/* Vertical line with gradient */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Comment content */}
      <div className="glass-effect rounded-xl p-4 mb-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative group/avatar">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 animate-gradient" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300" />
            </div>
            <div>
              <span className="text-sm font-semibold text-white">
                {comment.author}
              </span>
              <span className="block text-xs text-gray-400">
                {new Date(comment.created_at).toLocaleString()}
              </span>
            </div>
          </div>
          {user && (
            <button
              onClick={() => {
                setShowReply((prev) => !prev);
                setReplyCommentError("");
              }}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              {showReply ? "Cancel" : "Reply"}
            </button>
          )}
        </div>

        {/* Comment text */}
        <p className="text-gray-300 leading-relaxed">{comment.content}</p>

        {/* Reply form */}
        {showReply && user && (
          <form onSubmit={handleReplySubmit} className="space-y-3">
            <div className="relative group">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full glass-effect p-3 rounded-lg border border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 resize-none"
                placeholder="Write a reply..."
                rows={2}
              />
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none"></div>
            </div>
            
            {replyCommentError && (
              <p className="text-red-500 text-sm">{replyCommentError}</p>
            )}
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isPending}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white text-sm font-medium hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <span className="flex items-center space-x-2">
                    <span className="animate-spin">⚡</span>
                    <span>Posting...</span>
                  </span>
                ) : (
                  "Post Reply"
                )}
              </button>
            </div>
            
            {isError && (
              <p className="text-red-500 text-sm">Error posting reply.</p>
            )}
          </form>
        )}
      </div>

      {/* Replies section */}
      {comment.children && comment.children.length > 0 && (
        <div className="space-y-4">
          <button
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="flex items-center space-x-2 text-sm text-gray-400 hover:text-gray-300 transition-colors"
          >
            <span className="transform transition-transform duration-300">
              {isCollapsed ? "▼" : "▲"}
            </span>
            <span>
              {isCollapsed
                ? `Show ${comment.children.length} ${
                    comment.children.length === 1 ? "reply" : "replies"
                  }`
                : "Hide replies"}
            </span>
          </button>

          {!isCollapsed && (
            <div className="space-y-4">
              {comment.children.map((child, key) => (
                <CommentItem key={key} comment={child} postId={postId} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { CommentItem } from "./CommentItem";

interface Props {
  postId: number;
}

interface NewComment {
  content: string;
  parent_comment_id?: number | null;
}

export interface Comment {
  id: number;
  post_id: number;
  parent_comment_id: number | null;
  content: string;
  user_id: string;
  created_at: string;
  author: string;
}

const createComment = async (
  newComment: NewComment,
  postId: number,
  userId?: string,
  author?: string
) => {
  if (!userId || !author) {
    throw new Error("You must be logged in to comment.");
  }

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    content: newComment.content,
    parent_comment_id: newComment.parent_comment_id || null,
    user_id: userId,
    author: author,
  });

  if (error) throw new Error(error.message);
};

const fetchComments = async (postId: number): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data as Comment[];
};

export const CommentSection = ({ postId }: Props) => {
  const [newCommentText, setNewCommentText] = useState<string>("");
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [commentError, setCommentError] = useState<string>("");

  const {
    data: comments,
    isLoading,
    error,
  } = useQuery<Comment[], Error>({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
    refetchInterval: 5000,
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (newComment: NewComment) =>
      createComment(
        newComment,
        postId,
        user?.id,
        user?.user_metadata?.user_name
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      setCommentError("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCommentError("");
    if (!newCommentText) {
      setCommentError("Comment cannot be empty.");
      return;
    }
    mutate({ content: newCommentText, parent_comment_id: null });
    setNewCommentText("");
  };

  /* Map of Comments - Organize Replies - Return Tree  */
  const buildCommentTree = (
    flatComments: Comment[]
  ): (Comment & { children?: Comment[] })[] => {
    const map = new Map<number, Comment & { children?: Comment[] }>();
    const roots: (Comment & { children?: Comment[] })[] = [];

    flatComments.forEach((comment) => {
      map.set(comment.id, { ...comment, children: [] });
    });

    flatComments.forEach((comment) => {
      if (comment.parent_comment_id) {
        const parent = map.get(comment.parent_comment_id);
        if (parent) {
          parent.children!.push(map.get(comment.id)!);
        }
      } else {
        roots.push(map.get(comment.id)!);
      }
    });

    return roots;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-loading-bar w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
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

  const commentTree = comments ? buildCommentTree(comments) : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gradient">Comments</h3>
        <span className="text-gray-400">
          {commentTree.length} {commentTree.length === 1 ? 'comment' : 'comments'}
        </span>
      </div>

      {/* Create Comment Section */}
      {user ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <textarea
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              className="w-full glass-effect p-4 rounded-xl border border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 resize-none"
              placeholder="Write a comment..."
              rows={3}
            />
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none"></div>
          </div>
          
          {commentError && (
            <p className="text-red-500 text-sm">{commentError}</p>
          )}
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <span className="flex items-center space-x-2">
                  <span className="animate-spin">⚡</span>
                  <span>Posting...</span>
                </span>
              ) : (
                "Post Comment"
              )}
            </button>
          </div>
          
          {isError && (
            <p className="text-red-500 text-sm">Error posting comment.</p>
          )}
        </form>
      ) : (
        <div className="glass-effect p-4 rounded-xl text-center">
          <p className="text-gray-400">
            You must be{" "}
            <a href="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
              logged in
            </a>{" "}
            to post a comment.
          </p>
        </div>
      )}

      {/* Comments Display Section */}
      <div className="space-y-6">
        {commentTree.map((comment, key) => (
          <CommentItem key={key} comment={comment} postId={postId} />
        ))}
      </div>
    </div>
  );
};

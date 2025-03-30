import { ChangeEvent, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";
import { Community, fetchCommunities } from "./CommunityList";
import { useNavigate } from "react-router";

interface PostInput {
  title: string;
  content: string;
  user_name: string;
  avatar_url: string | null;
  community_id?: number | null;
}

const createPost = async (post: PostInput, imageFile: File) => {
  const filePath = `${post.title}-${Date.now()}-${imageFile.name}`;

  const { error: uploadError } = await supabase.storage
    .from("post-images")
    .upload(filePath, imageFile);

  if (uploadError) throw new Error(uploadError.message);

  const { data: publicURLData } = supabase.storage
    .from("post-images")
    .getPublicUrl(filePath);

  const { data, error } = await supabase
    .from("posts")
    .insert({ ...post, image_url: publicURLData.publicUrl });

  if (error) throw new Error(error.message);

  return data;
};

export const CreatePost = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [communityId, setCommunityId] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>("");

  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: communities } = useQuery<Community[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (data: { post: PostInput; imageFile: File }) => {
      return createPost(data.post, data.imageFile);
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) {
      setFileError("Please choose an image for the post.");
      return;
    }
    mutate({
      post: {
        title,
        content,
        user_name: user?.user_metadata.user_name || null,
        avatar_url: user?.user_metadata.avatar_url || null,
        community_id: communityId,
      },
      imageFile: selectedFile,
    });
    navigate("/");
  };

  const handleCommunityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCommunityId(value ? Number(value) : null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileError("");
      if (file) {
        const fileSizeInBytes = file.size;
        const fileSizeInKB = fileSizeInBytes / 1024;
        const fileType = file.type;

        if (fileSizeInKB > 1024) {
          setFileError("File size cannot be more than 1 MB");
          return;
        }
        if (
          "image/jpeg, image/png, image/gif, image/webp, image/svg+xml, image/bmp, image/tiff, image/x-icon".indexOf(
            fileType
          ) < 0
        ) {
          setFileError(
            "Following file types are allowed - jpeg, png, gif, webp, svg+xml, bmp, tiff, x-icon"
          );
          return;
        }
      }

      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      <div className="glass-effect rounded-xl p-6 space-y-6">
        {/* Title Input */}
        <div className="relative group">
          <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-300">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full glass-effect p-3 rounded-lg border border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
            required
          />
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none"></div>
        </div>

        {/* Content Input */}
        <div className="relative group">
          <label htmlFor="content" className="block mb-2 text-sm font-medium text-gray-300">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full glass-effect p-3 rounded-lg border border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 resize-none"
            rows={5}
            required
          />
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none"></div>
        </div>

        {/* Community Select */}
        <div className="relative group">
          <label htmlFor="community" className="block mb-2 text-sm font-medium text-gray-300">
            Select Community
          </label>
          <select
            id="community"
            onChange={handleCommunityChange}
            className="w-full glass-effect p-3 rounded-lg border border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 text-gray-300 bg-transparent"
          >
            <option value={""} className="bg-slate-900">-- Choose a Community --</option>
            {communities?.map((community, key) => (
              <option key={key} value={community.id} className="bg-slate-900">
                {community.name}
              </option>
            ))}
          </select>
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none"></div>
        </div>

        {/* File Upload */}
        <div className="relative group">
          <label htmlFor="image" className="block mb-2 text-sm font-medium text-gray-300">
            Upload Image (up to 1 MB)
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full glass-effect p-3 rounded-lg border border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 cursor-pointer"
          />
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none"></div>
          {fileError && (
            <p className="mt-2 text-sm text-red-500">{fileError}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <span className="flex items-center space-x-2">
                <span className="animate-spin">⚡</span>
                <span>Creating...</span>
              </span>
            ) : (
              "Create Post"
            )}
          </button>
        </div>

        {isError && (
          <p className="text-red-500 text-sm text-center">Error creating post.</p>
        )}
      </div>
    </form>
  );
};

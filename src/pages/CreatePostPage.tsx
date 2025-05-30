import { CreatePost } from "../components/CreatePost";

export const CreatePostPage = () => {
  return (
    <div className="pt-20">
      <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-green-500 to-yellow-500 bg-clip-text text-transparent">
        Create New Post
      </h2>
      <CreatePost />
    </div>
  );
};

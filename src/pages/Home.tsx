import { PostList } from "../components/PostList";

export const Home = () => {
  return (
    <div className="pt-10">
      <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-green-500 to-yellow-500 bg-clip-text text-transparent">
        Recent Posts
      </h2>
      <div>
        <PostList />
      </div>
    </div>
  );
};

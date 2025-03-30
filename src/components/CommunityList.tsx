import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { Link } from "react-router-dom";

export interface Community {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export const fetchCommunities = async (): Promise<Community[]> => {
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as Community[];
};

export const CommunityList = () => {
  const { data, error, isLoading } = useQuery<Community[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });

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

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {data?.map((community) => (
        <div key={community.id} className="relative group">
          {/* Gradient border effect */}
          <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none animate-gradient"></div>
          
          <Link
            to={`/community/${community.id}`}
            className="block relative z-10"
          >
            <div className="glass-effect rounded-xl p-6 space-y-3 transition-all duration-500 group-hover:scale-[1.02]">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gradient group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
                  {community.name}
                </h3>
                <span className="text-sm text-gray-400">
                  {new Date(community.created_at).toLocaleDateString()}
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-300 leading-relaxed">{community.description}</p>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

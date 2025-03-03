"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { getPosts, createPost, updatePost, deletePost } from "@/lib/api";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [userId, setUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [allTags, setAllTags] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await getPosts();
        setPosts(data);
        setFilteredPosts(data);
        
        // Extract all unique tags from posts
        const tagsSet = new Set();
        data.forEach(post => {
          if (post.tags && Array.isArray(post.tags)) {
            post.tags.forEach(tag => tagsSet.add(tag));
          }
        });
        setAllTags(Array.from(tagsSet));
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

    const fetchUser = () => {
      const token = Cookies.get("token");
      if (token) {
        try {
          const decoded = jwtDecode(token); // Decode token safely
          setUserId(decoded.user.id);

          console.log(decoded.user.id); // Assuming token contains 'id' as the user ID
        } catch (error) {
          console.error("Failed to decode token:", error);
        }
      }
    };

    fetchPosts();
    fetchUser();
  }, []);

  // Filter posts whenever search term or tag changes
  useEffect(() => {
    filterPosts();
  }, [searchTerm, selectedTag, posts]);

  const filterPosts = () => {
    let results = [...posts];

    // Filter by search term (title)
    if (searchTerm.trim() !== "") {
      results = results.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected tag
    if (selectedTag) {
      results = results.filter(post => 
        post.tags && post.tags.includes(selectedTag)
      );
    }

    setFilteredPosts(results);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTagSelect = (tag) => {
    setSelectedTag(tag === selectedTag ? "" : tag);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedTag("");
  };

  const handleCreatePost = async (postData) => {
    const token = Cookies.get("token");
    if (!token) return alert("You must be logged in to create a post.");

    try {
      const newPost = await createPost(postData, token);
      setPosts((prev) => [newPost.data, ...prev]);
      
      // Update allTags with any new tags
      if (postData.tags && Array.isArray(postData.tags)) {
        const newTags = postData.tags.filter(tag => !allTags.includes(tag));
        if (newTags.length > 0) {
          setAllTags(prev => [...prev, ...newTags]);
        }
      }
      
      setIsCreateModalOpen(false);
    } catch (error) {
      alert("Failed to create post");
    }
  };

  const handleEditPost = async (postData) => {
    const token = Cookies.get("token");
    if (!token) return alert("You must be logged in to edit a post.");

    try {
      const updatedPost = await updatePost(currentPost._id, postData, token);
      setPosts((prev) =>
        prev.map((post) =>
          post._id === currentPost._id ? updatedPost.data : post
        )
      );
      
      // Update allTags with any new tags
      if (postData.tags && Array.isArray(postData.tags)) {
        const newTags = postData.tags.filter(tag => !allTags.includes(tag));
        if (newTags.length > 0) {
          setAllTags(prev => [...prev, ...newTags]);
        }
      }
      
      setIsEditModalOpen(false);
    } catch (error) {
      alert("Failed to update post");
    }
  };

  const handleDeletePost = async () => {
    const token = Cookies.get("token");
    if (!token) return alert("You must be logged in to delete a post.");

    try {
      await deletePost(currentPost._id, token);
      setPosts((prev) => prev.filter((post) => post._id !== currentPost._id));
      setIsDeleteModalOpen(false);
    } catch (error) {
      alert("Failed to delete post");
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg p-6">
        <div className="flex justify-between items-center flex-col md:flex-row">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">All Posts</h1>
          <div className="flex gap-5">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 rounded-lg px-7 py-3 text-white hover:bg-blue-400 transition"
            >
              Add post
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="border border-blue-600 rounded-lg px-7 py-3 text-blue-600 hover:bg-blue-600 hover:text-white transition"
            >
              Dashboard
            </button>
          </div>
        </div>

        {/* Search and filter section */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="flex items-center">
              <button
                onClick={resetFilters}
                className="border border-gray-300 rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100 transition"
              >
                Reset
              </button>
            </div>
          </div>
          
          {/* Tags filter */}
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Filter by tag:</p>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagSelect(tag)}
                  className={`px-2 py-1 rounded-md text-xs font-medium ${
                    selectedTag === tag
                      ? "bg-blue-600 text-white"
                      : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredPosts.length > 0 ? (
          <ul className="space-y-6">
            {filteredPosts.map((post) => (
              <li
                key={post._id}
                className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition relative"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-600 mb-3">
                  By{" "}
                  <span className="font-semibold">
                    {post.author?.username || "Unknown"}
                  </span>{" "}
                  • {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <div className="mb-3 flex flex-wrap gap-2">
                  {post.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-medium cursor-pointer hover:bg-blue-200"
                      onClick={() => handleTagSelect(tag)}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <p className="text-gray-700">{post.content.slice(0, 150)}...</p>

                {userId && post.author?._id && userId === post.author._id && (
                  <div className="absolute top-4 right-4 flex gap-3">
                    <button
                      onClick={() => {
                        setCurrentPost(post);
                        setIsEditModalOpen(true);
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => {
                        setCurrentPost(post);
                        setIsDeleteModalOpen(true);
                      }}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No posts match your search criteria.</p>
            <button 
              onClick={resetFilters}
              className="mt-4 text-blue-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {isCreateModalOpen && (
        <PostModal
          title="Create Post"
          onSubmit={handleCreatePost}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}

      {isEditModalOpen && currentPost && (
        <PostModal
          title="Edit Post"
          initialData={currentPost}
          onSubmit={handleEditPost}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteModal
          onConfirm={handleDeletePost}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
    </div>
  );
}

// Reusable Post Modal Component
const PostModal = ({ title, initialData = {}, onSubmit, onClose }) => {
  const [form, setForm] = useState({
    title: initialData.title || "",
    content: initialData.content || "",
    tags: initialData.tags?.join(", ") || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title: form.title,
      content: form.content,
      tags: form.tags.split(",").map((tag) => tag.trim()),
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            className="border p-2 rounded"
          />
          <textarea
            placeholder="Content"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            required
            className="border p-2 rounded"
          ></textarea>
          <input
            type="text"
            placeholder="Tags (comma-separated)"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className="border p-2 rounded"
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="border rounded p-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white rounded p-2"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Reusable Delete Confirmation Modal
const DeleteModal = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
    <div className="bg-white p-6 rounded-lg shadow-lg w-80">
      <p className="text-lg mb-4">Are you sure you want to delete this post?</p>
      <div className="flex justify-end gap-3">
        <button onClick={onCancel} className="border rounded p-2">
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="bg-red-600 text-white rounded p-2"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/laravel-auth-context';
import { useRouter } from 'next/navigation';
import { apiClient, Post } from '@/lib/api';
import Link from 'next/link';

export default function PostsPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const postsPerPage = 10;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user, currentPage]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getPosts();
      setPosts(data || []);
      // For now, we'll disable pagination since Laravel API returns all posts
      // In a real app, you'd implement pagination in the Laravel API
      setTotalPages(1);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await apiClient.deletePost(id);
      fetchPosts();
    } catch (error: any) {
      alert('Error deleting post: ' + error.message);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <Link href="/posts" className="btn btn-ghost normal-case text-xl">
            Post Manager
          </Link>
        </div>
        <div className="flex-none gap-2">
          <Link href="/posts/create" className="btn btn-primary">
            Create Post
          </Link>
          <button onClick={signOut} className="btn btn-ghost">
            Sign Out
          </button>
        </div>
      </div>

      <div className="container mx-auto p-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">All Posts</h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : posts.length === 0 ? (
          <div className="alert">
            <span>No posts yet. Create your first post!</span>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <h2 className="card-title">{post.title}</h2>
                    <p className="text-sm text-base-content/60">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                    <p className="line-clamp-2">{post.content}</p>
                    <div className="card-actions justify-end mt-4">
                      <Link
                        href={`/posts/${post.id}`}
                        className="btn btn-sm btn-info"
                      >
                        View
                      </Link>
                      {user?.id === post.user_id && (
                        <>
                          <Link
                            href={`/posts/${post.id}/edit`}
                            className="btn btn-sm btn-warning"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="btn btn-sm btn-error"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="btn-group">
                  <button
                    className="btn"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    «
                  </button>
                  <button className="btn">
                    Page {currentPage} of {totalPages}
                  </button>
                  <button
                    className="btn"
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    »
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

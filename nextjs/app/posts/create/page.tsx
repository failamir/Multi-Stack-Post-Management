'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/laravel-auth-context';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import Link from 'next/link';

export default function CreatePostPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      await apiClient.createPost(title, content);
      router.push('/posts');
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <Link href="/posts" className="btn btn-ghost normal-case text-xl">
            Post Manager
          </Link>
        </div>
      </div>

      <div className="container mx-auto p-4 max-w-2xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Create New Post</h2>

            {error && (
              <div className="alert alert-error mb-4">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter post title"
                  className="input input-bordered"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-control mb-6">
                <label className="label">
                  <span className="label-text">Content</span>
                </label>
                <textarea
                  placeholder="Enter post content"
                  className="textarea textarea-bordered h-32"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className={`btn btn-primary ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Post'}
                </button>
                <Link href="/posts" className="btn btn-ghost">
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

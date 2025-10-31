'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { supabase, Post } from '@/lib/supabase';
import Link from 'next/link';

export default function EditPostPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPost();
  }, [params.id]);

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', params.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching post:', error);
      setLoading(false);
    } else if (data) {
      setPost(data);
      setTitle(data.title);
      setContent(data.content);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !post) return;

    setSaving(true);
    setError('');

    const { error: updateError } = await supabase
      .from('posts')
      .update({
        title,
        content,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
    } else {
      router.push(`/posts/${params.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!post || post.user_id !== user?.id) {
    return (
      <div className="min-h-screen bg-base-200">
        <div className="navbar bg-base-100 shadow-lg">
          <div className="flex-1">
            <Link href="/posts" className="btn btn-ghost normal-case text-xl">
              Post Manager
            </Link>
          </div>
        </div>
        <div className="container mx-auto p-4">
          <div className="alert alert-error">
            <span>
              {!post
                ? 'Post not found'
                : 'You do not have permission to edit this post'}
            </span>
          </div>
        </div>
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
      </div>

      <div className="container mx-auto p-4 max-w-2xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Edit Post</h2>

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
                  className={`btn btn-primary ${saving ? 'loading' : ''}`}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <Link href={`/posts/${params.id}`} className="btn btn-ghost">
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

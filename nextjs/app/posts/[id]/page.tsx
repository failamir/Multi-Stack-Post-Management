'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { supabase, Post } from '@/lib/supabase';
import Link from 'next/link';

export default function ViewPostPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

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
    } else if (data) {
      setPost(data);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    const { error } = await supabase.from('posts').delete().eq('id', params.id);

    if (error) {
      alert('Error deleting post: ' + error.message);
    } else {
      router.push('/posts');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!post) {
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
            <span>Post not found</span>
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

      <div className="container mx-auto p-4 max-w-3xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
            <p className="text-sm text-base-content/60 mb-4">
              Created: {new Date(post.created_at).toLocaleString()}
              {post.updated_at !== post.created_at && (
                <> • Updated: {new Date(post.updated_at).toLocaleString()}</>
              )}
            </p>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{post.content}</p>
            </div>

            <div className="card-actions justify-end mt-6">
              <Link href="/posts" className="btn btn-ghost">
                Back to Posts
              </Link>
              {user?.id === post.user_id && (
                <>
                  <Link
                    href={`/posts/${post.id}/edit`}
                    className="btn btn-warning"
                  >
                    Edit
                  </Link>
                  <button onClick={handleDelete} className="btn btn-error">
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $posts = Post::with(['user:id,name'])
            ->latest()
            ->paginate(10);

        return response()->json($posts);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
        ]);

        $slug = Str::slug($validated['title']);
        // Ensure unique slug
        $baseSlug = $slug;
        $i = 1;
        while (Post::where('slug', $slug)->exists()) {
            $slug = $baseSlug.'-'.($i++);
        }

        $post = Post::create([
            'user_id' => Auth::id(),
            'title' => $validated['title'],
            'slug' => $slug,
            'body' => $validated['body'],
        ]);

        return response()->json($post->load('user:id,name'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        return response()->json($post->load('user:id,name'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)
    {
        if ($post->user_id !== Auth::id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'body' => ['sometimes', 'required', 'string'],
            'slug' => [
                'sometimes', 'required', 'string', 'max:255',
                Rule::unique('posts', 'slug')->ignore($post->id),
            ],
        ]);

        if (array_key_exists('title', $validated) && !array_key_exists('slug', $validated)) {
            $candidate = Str::slug($validated['title']);
            if ($candidate !== $post->slug && Post::where('slug', $candidate)->where('id', '!=', $post->id)->exists()) {
                $baseSlug = $candidate;
                $i = 1;
                while (Post::where('slug', $candidate)->where('id', '!=', $post->id)->exists()) {
                    $candidate = $baseSlug.'-'.($i++);
                }
            }
            $validated['slug'] = $candidate;
        }

        $post->update($validated);

        return response()->json($post->fresh()->load('user:id,name'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        if ($post->user_id !== Auth::id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $post->delete();
        return response()->json(['message' => 'Deleted']);
    }
}

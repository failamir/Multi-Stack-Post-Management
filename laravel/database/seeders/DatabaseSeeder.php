<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create a test user
        $user = \App\Models\User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
        ]);

        // Create some sample posts
        \App\Models\Post::create([
            'user_id' => $user->id,
            'title' => 'Welcome to Laravel API',
            'content' => 'This is a sample post ',
        ]);

        \App\Models\Post::create([
            'user_id' => $user->id,
            'title' => 'Another Sample Post',
            'content' => 'This is another sample post ',
        ]);

        \App\Models\Post::create([
            'user_id' => $user->id,
            'title' => 'Testing the Integration',
            'content' => 'This post demonstrates',
        ]);
    }
}

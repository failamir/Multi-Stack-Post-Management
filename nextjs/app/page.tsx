import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <h2 className="card-title text-3xl mb-4">Welcome</h2>
          <p className="mb-6">A simple post management application with authentication</p>
          <div className="card-actions flex-col w-full gap-2">
            <Link href="/auth/signin" className="btn btn-primary w-full">
              Sign In
            </Link>
            <Link href="/auth/signup" className="btn btn-outline w-full">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

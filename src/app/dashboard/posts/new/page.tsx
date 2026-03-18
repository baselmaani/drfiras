import { PostForm } from "@/components/dashboard/PostForm";
import { createPost } from "@/lib/actions/posts";
import Link from "next/link";

export default function NewPostPage() {
  return (
    <div>
      <div className="mb-8">
        <Link
          href="/dashboard/posts"
          className="text-gray-400 hover:text-gray-600 text-sm mb-2 inline-flex items-center gap-1"
        >
          ← Back to Posts
        </Link>
        <h1
          className="text-2xl font-bold text-[#1b4f72] mt-1"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          New Blog Post
        </h1>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <PostForm action={createPost} />
      </div>
    </div>
  );
}

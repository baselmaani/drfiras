import { db } from "@/lib/db";
import { PostForm } from "@/components/dashboard/PostForm";
import { updatePost } from "@/lib/actions/posts";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await db.post.findUnique({ where: { id: Number(id) } });
  if (!post) notFound();

  const action = updatePost.bind(null, post.id);

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
          Edit: {post.title}
        </h1>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <PostForm action={action} post={post} />
      </div>
    </div>
  );
}

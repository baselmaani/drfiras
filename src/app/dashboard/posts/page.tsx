import { db } from "@/lib/db";
import { deletePost } from "@/lib/actions/posts";
import { DeleteButton } from "@/components/dashboard/DeleteButton";
import Link from "next/link";

export default async function PostsPage() {
  const posts = await db.post.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-gray-400 text-sm">Dashboard / Blog</p>
          <h1
            className="text-2xl font-bold text-[#1b4f72]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Blog Posts
          </h1>
        </div>
        <Link
          href="/dashboard/posts/new"
          className="bg-[#1b4f72] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#163f5a] transition-colors"
        >
          + New Post
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {posts.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg mb-2">No blog posts yet</p>
            <Link href="/dashboard/posts/new" className="text-[#1b4f72] hover:underline text-sm">
              Create your first post →
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Title</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Slug</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Status</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Published</th>
                <th className="text-right px-6 py-3 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-medium text-gray-800 max-w-xs truncate">
                    {post.title}
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">{post.slug}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        post.published
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {post.published && (
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="text-gray-400 hover:text-[#1b4f72] text-xs"
                        >
                          View
                        </Link>
                      )}
                      <Link
                        href={`/dashboard/posts/${post.id}/edit`}
                        className="text-[#1b4f72] hover:underline text-xs font-medium"
                      >
                        Edit
                      </Link>
                      <DeleteButton id={post.id} action={deletePost} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

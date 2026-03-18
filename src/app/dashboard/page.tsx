import { db } from "@/lib/db";
import Link from "next/link";

async function getStats() {
  const [services, beforeAfters, posts, publishedPosts] = await Promise.all([
    db.service.count(),
    db.beforeAfter.count(),
    db.post.count(),
    db.post.count({ where: { published: true } }),
  ]);
  const recentPosts = await db.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });
  return { services, beforeAfters, posts, publishedPosts, recentPosts };
}

export default async function DashboardPage() {
  const stats = await getStats();

  const cards = [
    {
      label: "Services",
      value: stats.services,
      href: "/dashboard/services",
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Before & Afters",
      value: stats.beforeAfters,
      href: "/dashboard/before-after",
      color: "bg-purple-50 text-purple-700",
    },
    {
      label: "Blog Posts",
      value: stats.posts,
      href: "/dashboard/posts",
      color: "bg-green-50 text-green-700",
    },
    {
      label: "Published Posts",
      value: stats.publishedPosts,
      href: "/dashboard/posts",
      color: "bg-amber-50 text-amber-700",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1
          className="text-2xl font-bold text-[#1b4f72]"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Dashboard
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Welcome back — manage your website content here.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow"
          >
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">
              {card.label}
            </p>
            <p className={`text-3xl font-bold ${card.color} inline-block px-3 py-1 rounded-xl`}>
              {card.value}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {[
          { href: "/dashboard/services/new", label: "+ New Service" },
          { href: "/dashboard/before-after/new", label: "+ New Before & After" },
          { href: "/dashboard/posts/new", label: "+ New Blog Post" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="bg-[#1b4f72] text-white text-center py-3 rounded-xl text-sm font-medium hover:bg-[#154460] transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Recent Posts */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-800 mb-4 text-sm uppercase tracking-wide">
          Recent Posts
        </h2>
        {stats.recentPosts.length === 0 ? (
          <p className="text-gray-400 text-sm">No posts yet.</p>
        ) : (
          <ul className="space-y-3">
            {stats.recentPosts.map((post) => (
              <li
                key={post.id}
                className="flex items-center justify-between text-sm"
              >
                <Link
                  href={`/dashboard/posts/${post.id}/edit`}
                  className="text-[#1b4f72] hover:underline font-medium"
                >
                  {post.title}
                </Link>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    post.published
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {post.published ? "Published" : "Draft"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

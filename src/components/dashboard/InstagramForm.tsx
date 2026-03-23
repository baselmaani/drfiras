"use client";
import { useActionState, useState } from "react";
import { updateSettings } from "@/lib/actions/settings";
import { ImageUpload } from "./ImageUpload";

type Values = Record<string, string>;

interface InstaPost {
  image: string;
  caption?: string;
  url?: string;
}

const cls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 bg-white";

function PostCard({
  post, index, onRemove, onChange,
}: {
  post: InstaPost;
  index: number;
  onRemove: () => void;
  onChange: (p: InstaPost) => void;
}) {
  return (
    <div className="border border-gray-200 rounded-2xl p-4 space-y-3 bg-white">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-600">Post #{index + 1}</span>
        <button type="button" onClick={onRemove} className="text-red-400 hover:text-red-600 text-xs font-medium">Remove</button>
      </div>
      <ImageUpload
        name={`instaPost_image_${index}`}
        label="Post Image"
        defaultValue={post.image}
        onUpload={(url) => onChange({ ...post, image: url })}
      />
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Caption (optional)</label>
        <input value={post.caption ?? ""} onChange={e => onChange({ ...post, caption: e.target.value })} className={cls} placeholder="Smile transformation ✨" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Post URL (optional)</label>
        <input value={post.url ?? ""} onChange={e => onChange({ ...post, url: e.target.value })} className={cls} placeholder="https://www.instagram.com/p/..." />
      </div>
    </div>
  );
}

export function InstagramForm({ values }: { values: Values }) {
  const [state, formAction, pending] = useActionState(updateSettings, null);

  const [posts, setPosts] = useState<InstaPost[]>(() => {
    try {
      return values.instagramPosts ? JSON.parse(values.instagramPosts) : [];
    } catch { return []; }
  });

  const addPost = () => setPosts(p => [...p, { image: "", caption: "", url: "" }]);
  const removePost = (i: number) => setPosts(p => p.filter((_, idx) => idx !== i));
  const updatePost = (i: number, updated: InstaPost) => setPosts(p => p.map((post, idx) => (idx === i ? updated : post)));

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{state.error}</div>
      )}
      {state?.success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">Saved successfully.</div>
      )}
      <input type="hidden" name="instagramPosts" value={JSON.stringify(posts)} />

      {/* Profile */}
      <div className="border border-gray-100 rounded-2xl p-5 space-y-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Profile Info</h3>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              name="instagramEnabled"
              value="true"
              defaultChecked={values.instagramEnabled !== "false"}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-[#1b4f72]/30 rounded-full peer peer-checked:bg-[#1b4f72] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
            <span className="ml-3 text-sm font-medium text-gray-700">Show section</span>
          </label>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Instagram Handle</label>
            <input name="instagramHandle" defaultValue={values.instagramHandle ?? ""} className={cls} placeholder="dr.firaszoghieb" />
            <p className="text-xs text-gray-400 mt-1">Without the @</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Follower Count</label>
            <input name="instagramFollowers" defaultValue={values.instagramFollowers ?? ""} className={cls} placeholder="12.4k" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Instagram Profile URL</label>
            <input name="instagram" defaultValue={values.instagram ?? ""} className={cls} placeholder="https://www.instagram.com/dr.firaszoghieb" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Profile Bio</label>
          <textarea name="instagramBio" rows={2} defaultValue={values.instagramBio ?? ""} className={`${cls} resize-none`} placeholder="Cosmetic Dentist · Composite Bonding · Invisalign ✨" />
        </div>
      </div>

      {/* Posts */}
      <div className="border border-gray-100 rounded-2xl p-5 space-y-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Posts ({posts.length})</h3>
          <button
            type="button"
            onClick={addPost}
            className="text-xs font-semibold text-[#1b4f72] border border-[#1b4f72]/30 px-3 py-1.5 rounded-lg hover:bg-[#1b4f72]/5 transition-colors"
          >
            + Add Post
          </button>
        </div>
        {posts.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">No posts added — placeholder images will be shown.</p>
        )}
        {posts.map((p, i) => (
          <PostCard key={i} post={p} index={i} onRemove={() => removePost(i)} onChange={u => updatePost(i, u)} />
        ))}
      </div>

      <button type="submit" disabled={pending} className="bg-[#1b4f72] text-white px-8 py-3 rounded-xl font-medium text-sm hover:bg-[#154460] transition-colors disabled:opacity-60">
        {pending ? "Saving…" : "Save Instagram Content"}
      </button>
    </form>
  );
}

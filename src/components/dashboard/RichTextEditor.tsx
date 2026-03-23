"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useState, useCallback } from "react";

// ─── Toolbar button ─────────────────────────────────────────────────────────
function Btn({
  active,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault(); // keep editor focus
        onClick();
      }}
      className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
        active
          ? "bg-[#1b4f72] text-white"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-gray-200 mx-0.5 self-center" />;
}

// ─── Main component ──────────────────────────────────────────────────────────
interface Props {
  name: string;
  defaultValue?: string;
  placeholder?: string;
}

export function RichTextEditor({
  name,
  defaultValue = "",
  placeholder = "Start writing…",
}: Props) {
  const [html, setHtml] = useState(defaultValue);
  const [showLink, setShowLink] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkNewTab, setLinkNewTab] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#c9a84c] underline underline-offset-2",
        },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: defaultValue,
    onUpdate({ editor }) {
      setHtml(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: [
          "focus:outline-none min-h-[280px]",
          // prose‑like styles scoped to the editable area
          "[&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-[#1b4f72] [&_h2]:mt-5 [&_h2]:mb-1.5",
          "[&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-[#1b4f72] [&_h3]:mt-4 [&_h3]:mb-1",
          "[&_p]:text-gray-700 [&_p]:leading-relaxed [&_p]:mb-3 [&_p]:text-sm",
          "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ul_li]:text-gray-700 [&_ul_li]:text-sm [&_ul_li]:mb-0.5",
          "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3 [&_ol_li]:text-gray-700 [&_ol_li]:text-sm [&_ol_li]:mb-0.5",
          "[&_a]:text-[#c9a84c] [&_a]:underline [&_a]:underline-offset-2",
          "[&_strong]:font-semibold",
          "[&_.is-editor-empty]:before:content-[attr(data-placeholder)] [&_.is-editor-empty]:before:text-gray-400 [&_.is-editor-empty]:before:pointer-events-none [&_.is-editor-empty]:before:float-left [&_.is-editor-empty]:before:h-0",
        ].join(" "),
      },
    },
  });

  const applyLink = useCallback(() => {
    if (!editor || !linkUrl.trim()) return;
    const attrs: { href: string; target?: string; rel?: string } = {
      href: linkUrl.trim(),
    };
    if (linkNewTab) {
      attrs.target = "_blank";
      attrs.rel = "noopener noreferrer";
    }
    if (editor.state.selection.empty) {
      // No text selected → insert URL as clickable text
      editor
        .chain()
        .focus()
        .insertContent(
          `<a href="${attrs.href}"${attrs.target ? ` target="${attrs.target}" rel="noopener noreferrer"` : ""}>${attrs.href}</a>`
        )
        .run();
    } else {
      editor.chain().focus().setLink(attrs).run();
    }
    setShowLink(false);
    setLinkUrl("");
    setLinkNewTab(false);
  }, [editor, linkUrl, linkNewTab]);

  const openLinkPanel = useCallback(() => {
    if (!editor) return;
    const existing = editor.getAttributes("link").href ?? "";
    setLinkUrl(existing);
    setLinkNewTab(editor.getAttributes("link").target === "_blank");
    setShowLink((v) => !v);
  }, [editor]);

  // Loading skeleton
  if (!editor) {
    return (
      <div className="border border-gray-200 rounded-xl h-[340px] bg-gray-50 animate-pulse" />
    );
  }

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden transition-shadow focus-within:ring-2 focus-within:ring-[#1b4f72]/30 focus-within:border-[#1b4f72]">
      {/* Hidden input carries final HTML to server action */}
      <input type="hidden" name={name} value={html} />

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-1 px-3 py-2 bg-gray-50 border-b border-gray-100">
        {/* Block type */}
        <span className="text-[10px] text-gray-400 uppercase tracking-wider mr-1">Block</span>
        <Btn
          title="Heading 2 — main section (SEO: use for each topic)"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </Btn>
        <Btn
          title="Heading 3 — sub-section"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </Btn>
        <Btn
          title="Normal paragraph"
          active={editor.isActive("paragraph")}
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          ¶
        </Btn>

        <Divider />

        {/* Inline format */}
        <span className="text-[10px] text-gray-400 uppercase tracking-wider mr-1">Style</span>
        <Btn
          title="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <b>B</b>
        </Btn>
        <Btn
          title="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <i>I</i>
        </Btn>

        <Divider />

        {/* Lists */}
        <Btn
          title="Bullet list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • List
        </Btn>
        <Btn
          title="Numbered list"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. List
        </Btn>

        <Divider />

        {/* Link */}
        <Btn
          title="Insert / edit link (supports internal paths like /services/composite-bonding)"
          active={editor.isActive("link")}
          onClick={openLinkPanel}
        >
          🔗 Link
        </Btn>
        {editor.isActive("link") && (
          <Btn
            title="Remove link"
            onClick={() => editor.chain().focus().unsetLink().run()}
          >
            ✕
          </Btn>
        )}

        <Divider />

        {/* HR */}
        <Btn
          title="Horizontal rule (section divider)"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          —
        </Btn>
      </div>

      {/* ── Link panel ── */}
      {showLink && (
        <div className="flex flex-wrap items-end gap-3 px-4 py-3 bg-amber-50 border-b border-amber-100">
          <div className="flex-1 min-w-[220px]">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              URL — internal{" "}
              <code className="text-[#c9a84c] font-mono">/services/composite-bonding</code>
              {" "}or external{" "}
              <code className="text-gray-400 font-mono">https://...</code>
            </label>
            <input
              autoFocus
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); applyLink(); }
                if (e.key === "Escape") setShowLink(false);
              }}
              placeholder="/services/composite-bonding"
              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 bg-white"
            />
          </div>
          <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer pb-2">
            <input
              type="checkbox"
              checked={linkNewTab}
              onChange={(e) => setLinkNewTab(e.target.checked)}
              className="rounded"
            />
            Open in new tab
          </label>
          <div className="flex gap-2 pb-1">
            <button
              type="button"
              onClick={applyLink}
              className="bg-[#1b4f72] text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-[#154460] transition-colors"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={() => setShowLink(false)}
              className="text-gray-500 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Tip bar ── */}
      <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-50/60 border-b border-blue-100/60 text-[10px] text-blue-400">
        <span>💡</span>
        <span>
          <strong>SEO tip:</strong> Use <b>H2</b> for each main topic (e.g. "What Is It?", "Benefits", "FAQ") then 2–3 sentences below each. Use <b>H3</b> for sub-points. Link to related services with 🔗 Link.
        </span>
      </div>

      {/* ── Editor area ── */}
      <EditorContent editor={editor} className="px-4 py-4 text-sm text-gray-800" />
    </div>
  );
}
